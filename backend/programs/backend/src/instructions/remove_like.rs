use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct RemoveLike<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    /// CHECK: no seeds check because it can be any solution
    /// Solution that is being removed its like
    #[account(mut)]
    pub solution_pda: Account<'info, Solution>,

    /// Proof that you already liked it before
    #[account(
        mut,
        seeds = [
            LIKE_CERTIFICATE_TAG.as_ref(),
            signer.key().as_ref(),
            solution_pda.key().as_ref()
        ],
        bump,
        close = treasury,
    )]
    pub like_certificate: Account<'info, LikeCertificate>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<RemoveLike>) -> Result<()> {
    // Decrease like count in Solution
    ctx.accounts.solution_pda.likes -= 1;

    Ok(())
}
