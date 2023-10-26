use anchor_lang::prelude::*;

use crate::{constants::*, error::CaseError, state::*, utils::pay_rent_and_refund_to_user};

#[derive(Accounts)]
#[instruction(solution: String)]
pub struct AddSolution<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump = treasury.bump)]
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
        space = Solution::BASE_LEN,
        payer = signer
    )]
    pub solution_pda: Account<'info, Solution>,

    #[account(mut, seeds = [USER_INFO_TAG.as_ref(), signer.key().as_ref()], bump = user_profile.bump)]
    pub user_profile: Account<'info, UserInfo>,

    #[account(seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump = global_config.bump)]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn add_solution_handler(ctx: Context<AddSolution>, solution: String) -> Result<()> {
    msg!("Adding solution {}...", solution);

    // Check if case has enough solution slots left
    require!(
        ctx.accounts.case.solutions < MAX_SOLUTIONS_ALLOWED,
        CaseError::MaxSolutionsAllowed
    );

    // Check that solution works (current state + solution = solved state for its set)
    msg!("Checking validity...");
    let compressed_solution = ctx
        .accounts
        .case
        .validate_and_compress_solution(&solution)?;

    // Alloc size for solution Vec<u8>
    let solution_len = Solution::BASE_LEN + compressed_solution.len();
    ctx.accounts
        .solution_pda
        .to_account_info()
        .realloc(solution_len, false)?;

    // Pay rent and refund
    let refund_amount = ctx.accounts.solution_pda.to_account_info().lamports();
    let extra_amount = ctx
        .accounts
        .rent
        .minimum_balance(solution_len)
        .saturating_sub(refund_amount);

    pay_rent_and_refund_to_user(
        refund_amount,
        extra_amount,
        ctx.accounts.global_config.max_fund_limit,
        ctx.accounts
            .treasury
            .to_account_info()
            .try_borrow_mut_lamports()?,
        ctx.accounts
            .solution_pda
            .to_account_info()
            .try_borrow_mut_lamports()?,
        ctx.accounts.signer.try_borrow_mut_lamports()?,
        &mut ctx.accounts.user_profile,
    )?;

    // Populate Solution fields
    ctx.accounts.solution_pda.case = ctx.accounts.case.key();
    ctx.accounts.solution_pda.moves = compressed_solution;
    ctx.accounts.solution_pda.self_index = ctx.accounts.case.solutions;
    ctx.accounts.solution_pda.author = ctx.accounts.signer.key();
    ctx.accounts.solution_pda.timestamp = Clock::get()?.unix_timestamp as u64;
    ctx.accounts.solution_pda.bump = ctx.bumps.solution_pda;

    // Update Case
    ctx.accounts.case.solutions += 1;

    // Update profile
    ctx.accounts.user_profile.submitted_solutions += 1;

    Ok(())
}
