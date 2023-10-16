use anchor_lang::prelude::*;
use std::str::FromStr;

use crate::{constants::*, error::*, state::*};

#[derive(Accounts)]
pub struct AddPrivilegedUser<'info> {
    #[account(mut)]
    pub granter: Signer<'info>,

    /// CHECK: any account
    #[account(mut)]
    pub grantee: UncheckedAccount<'info>,

    // Existing privilege (not needed for program deployer)
    #[account(seeds = [PRIVILEGE_TAG.as_ref(), granter.key().as_ref()], bump = granter_privilege.bump)]
    pub granter_privilege: Option<Account<'info, Privilege>>,

    // New privilege account
    #[account(
        init,
        seeds = [PRIVILEGE_TAG.as_ref(), grantee.key().as_ref()],
        bump,
        space = Privilege::LEN,
        payer = granter
    )]
    pub grantee_privilege: Account<'info, Privilege>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct AddPrivilegedUserEvent {
    pub granter: Pubkey,
    pub grantee: Pubkey,
}

pub fn handler(ctx: Context<AddPrivilegedUser>) -> Result<()> {
    // If no privilege was passed for granter, it must be the deployer
    if ctx.accounts.granter_privilege.is_none() {
        require_keys_eq!(
            ctx.accounts.granter.key(),
            Pubkey::from_str(DEPLOYER_KEY).unwrap(),
            PrivilegeError::PrivilegeEscalation,
        );
    }

    // Store data and emit event

    ctx.accounts.grantee_privilege.granter = ctx.accounts.granter.key();
    ctx.accounts.grantee_privilege.grantee = ctx.accounts.grantee.key();
    ctx.accounts.grantee_privilege.bump = *ctx.bumps.get("grantee_privilege").unwrap();

    emit!(AddPrivilegedUserEvent {
        granter: ctx.accounts.grantee_privilege.granter,
        grantee: ctx.accounts.grantee_privilege.grantee,
    });

    Ok(())
}
