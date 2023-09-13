use anchor_lang::prelude::*;

use crate::{state::*, constants::*};

#[derive(Accounts)]
#[instruction(revoked_user: Pubkey)]
pub struct RevokePrivilege<'info> {
    #[account(mut)]
    pub revoker: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), revoker.key().as_ref()], bump = privilege.bump)]
    pub privilege: Account<'info, Privilege>,

    #[account(
        mut,
        close = treasury,
        seeds = [PRIVILEGE_TAG.as_ref(), revoked_user.as_ref()],
        bump = revoked_privilege.bump
    )]
    pub revoked_privilege: Account<'info, Privilege>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: SystemAccount<'info>,
}

#[event]
pub struct RevokePrivilegeEvent {
    pub revoker: Pubkey,
    pub revoked_user: Pubkey,
}


pub fn handler(ctx: Context<RevokePrivilege>, revoked_user: Pubkey) -> Result<()> {
    emit!(RevokePrivilegeEvent {
        revoker: ctx.accounts.revoker.key(),
        revoked_user,
    });

    Ok(())
}