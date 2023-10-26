use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct RemoveLike<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump = treasury.bump)]
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

    #[account(
        mut,
        seeds = [USER_INFO_TAG.as_ref(), solution_pda.author.as_ref()],
        bump = author_profile.bump
    )]
    pub author_profile: Account<'info, UserInfo>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn remove_like_handler(ctx: Context<RemoveLike>) -> Result<()> {
    msg!(
        "Removing like from solution {}...",
        ctx.accounts.solution_pda.self_index
    );

    // Decrease like count in Solution
    ctx.accounts.solution_pda.likes -= 1;

    if ctx.accounts.signer.key() != ctx.accounts.solution_pda.author {
        ctx.accounts.author_profile.likes_received -= 1;
    }

    Ok(())
}
