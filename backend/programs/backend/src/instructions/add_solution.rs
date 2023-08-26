use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
#[instruction(solution: String)]
pub struct AddSolution<'info> {
    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: SystemAccount<'info>,

    /// CHECK: no seeds needed because it can be any case
    #[account(
        mut,
        realloc = case.to_account_info().data_len() + solution.len(),
        realloc::payer = treasury,
        realloc::zero = false,
    )]
    pub case: Account<'info, Case>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddSolution>, solution: String) -> Result<()> {
    // TODO: validate solution string sanity
    // TODO: validate that it works and revert if it doesn't

    ctx.accounts.case.solutions.push(solution);

    Ok(())
}
