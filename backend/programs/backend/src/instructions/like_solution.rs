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

    #[account(mut, seeds = [USER_INFO_TAG.as_ref(), solution_pda.author.as_ref()], bump = author_profile.bump)]
    pub author_profile: Account<'info, UserInfo>,

    #[account(mut, seeds = [USER_INFO_TAG.as_ref(), signer.key().as_ref()], bump = user_profile.bump)]
    pub user_profile: Account<'info, UserInfo>,

    #[account(seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump)]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<LikeSolution>) -> Result<()> {
    // Add to like count in Solution and author UserInfo if we're not liking self
    ctx.accounts.solution_pda.likes += 1;
    if ctx.accounts.signer.key() != ctx.accounts.solution_pda.author {
        ctx.accounts.author_profile.likes_received += 1;
    }

    ctx.accounts.like_certificate.user = ctx.accounts.signer.key();
    ctx.accounts.like_certificate.solution = ctx.accounts.solution_pda.key();

    // Refund rent to Signer if user has some quota left
    let like_certificate_rent = ctx.accounts.rent.minimum_balance(LikeCertificate::LEN);
    if ctx.accounts.user_profile.sol_funded + like_certificate_rent < ctx.accounts.global_config.max_fund_limit {
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
        ctx.accounts.user_profile.sol_funded += like_certificate_rent;
    }

    Ok(())
}
