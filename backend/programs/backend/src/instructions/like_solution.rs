use anchor_lang::prelude::*;

use crate::{constants::*, error::TreasuryError, state::*};

#[derive(Accounts)]
pub struct LikeSolution<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    /// CHECK: no seeds check because it can be any solution
    /// Solution that is being liked
    #[account(mut)]
    pub solution_pda: Account<'info, Solution>,

    /// Certificate to avoid double-liking the same solution
    #[account(
        init,
        seeds = [LIKE_CERTIFICATE_TAG.as_ref(), signer.key().as_ref(), solution_pda.key().as_ref()],
        bump,
        payer = signer,
        space = LikeCertificate::LEN,
    )]
    pub like_certificate: Account<'info, LikeCertificate>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<LikeSolution>) -> Result<()> {
    // Add to like count in Solution
    ctx.accounts.solution_pda.likes += 1;

    ctx.accounts.like_certificate.user = ctx.accounts.signer.key();
    ctx.accounts.like_certificate.solution = ctx.accounts.solution_pda.key();

    // Refund rent to Signer
    let like_certificate_rent = ctx.accounts.rent.minimum_balance(LikeCertificate::LEN);
    require!(
        ctx.accounts.treasury.to_account_info().lamports() >= like_certificate_rent,
        TreasuryError::TreasuryNeedsFunds
    );
    **ctx
        .accounts
        .treasury
        .to_account_info()
        .try_borrow_mut_lamports()? -= like_certificate_rent;
    **ctx.accounts.signer.try_borrow_mut_lamports()? += like_certificate_rent;

    Ok(())
}
