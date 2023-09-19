use anchor_lang::prelude::*;

use crate::{constants::*, state::*, error::CaseError};

#[derive(Accounts)]
pub struct RemoveLike<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: no seeds needed because it can be any case
    #[account(mut)]
    pub case: Account<'info, Case>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        close = treasury,
        seeds = [LIKE_TAG.as_ref(), signer.key().as_ref(), case.key().as_ref()],
        bump
    )]
    pub like: Account<'info, Like>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<RemoveLike>) -> Result<()> {
    // Remove like from solution elem in the Case PDA array
    match ctx.accounts.case.solutions.get_mut(ctx.accounts.like.solution_index as usize) {
        Some(sol) => sol.likes -= 1,
        None => return Err(error!(CaseError::Cataclysm)), // honestly if this happens you deserve it
    }

    Ok(())
}
