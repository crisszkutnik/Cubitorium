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
    #[account(
        mut,
        realloc = case.to_account_info().data_len() + (32 + 4 + solution.len() + 8),
        realloc::payer = signer,
        realloc::zero = false,
    )]
    pub case: Account<'info, Case>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<AddSolution>, solution: String) -> Result<()> {
    // Check if case has enough solutions
    require!(ctx.accounts.case.solutions.len() < MAX_SOLUTIONS_ALLOWED, CaseError::MaxSolutionsAllowed);

    // Refund extra rent
    let extra_rent = ctx.accounts.rent.minimum_balance(solution.len());
    require!(
        ctx.accounts.treasury.to_account_info().lamports() >= extra_rent,
        TreasuryError::TreasuryNeedsFunds
    );
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= extra_rent;
    **ctx.accounts.signer.try_borrow_mut_lamports()? += extra_rent;

    // Check that solution works (setup + solution = solved state for its set)
    validate_set_setup_solution(
        &ctx.accounts.case.set,
        &ctx.accounts.case.setup,
        &solution
    )?;

    ctx.accounts.case.solutions.push(Solution {
        author: ctx.accounts.signer.key(),
        moves: solution,
        likes: 0,
        timestamp: Clock::get()?.unix_timestamp as u64,
    });

    Ok(())
}
