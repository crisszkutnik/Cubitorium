use anchor_lang::prelude::*;

use crate::{constants::*, state::*, utils::validate_set_setup_solution, error::{CaseError, TreasuryError}};

#[derive(Accounts)]
#[instruction(solution: String)]
pub struct AddSolution<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    /// CHECK: no seeds needed because it can be any case
    #[account(mut)]
    pub case: Account<'info, Case>,

    #[account(
        init,
        seeds = [
            SOLUTION_TAG.as_ref(),
            case.key().as_ref(),
            &solution.hash_solution()
        ],
        bump,
        payer = signer,
        space = Solution::BASE_LEN + solution.len()
    )]
    pub solution_pda: Account<'info, Solution>,

    #[account(mut, seeds = [USER_INFO_TAG.as_ref(), signer.key().as_ref()], bump = user_profile.bump)]
    pub user_profile: Account<'info, UserInfo>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<AddSolution>, solution: String) -> Result<()> {
    // Check if case has enough solutions
    require!(ctx.accounts.case.solutions < MAX_SOLUTIONS_ALLOWED, CaseError::MaxSolutionsAllowed);

    // Refund rent
    let solution_pda_rent = ctx.accounts.rent.minimum_balance(Solution::BASE_LEN + solution.len());
    require!(
        ctx.accounts.treasury.to_account_info().lamports() >= solution_pda_rent,
        TreasuryError::TreasuryNeedsFunds
    );
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= solution_pda_rent;
    **ctx.accounts.signer.try_borrow_mut_lamports()? += solution_pda_rent;

    // Check that solution works (setup + solution = solved state for its set)
    validate_set_setup_solution(
        &ctx.accounts.case.set,
        &ctx.accounts.case.setup,
        &solution
    )?;

    // Populate Solution fields
    ctx.accounts.solution_pda.case = ctx.accounts.case.key();
    ctx.accounts.solution_pda.moves = solution;
    ctx.accounts.solution_pda.self_index = ctx.accounts.case.solutions;
    ctx.accounts.solution_pda.author = ctx.accounts.signer.key();
    ctx.accounts.solution_pda.timestamp = Clock::get()?.unix_timestamp as u64;

    // Update Case
    ctx.accounts.case.solutions += 1;

    // Update profile
    ctx.accounts.user_profile.submitted_solutions += 1;

    Ok(())
}
