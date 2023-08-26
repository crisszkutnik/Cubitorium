use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct AddPrivilegedUser<'info> {
    #[account(mut)]
    pub granter: Signer<'info>,

    /// CHECK: any account
    #[account(mut)]
    pub grantee: UncheckedAccount<'info>,

    // Existing privilege
    #[account(seeds = [PRIVILEGE_TAG.as_ref(), granter.key().as_ref()], bump = granter_privilege.bump)]
    pub granter_privilege: Account<'info, Privilege>,

    // New privilege account
    #[account(
        init,
        seeds = [PRIVILEGE_TAG.as_ref(), granter.key().as_ref()],
        bump,
        space = Privilege::LEN,
        payer = grantee
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
    ctx.accounts.grantee_privilege.bump = *ctx.bumps.get("grantee_privilege").unwrap();

    emit!(AddPrivilegedUserEvent {
        granter: ctx.accounts.grantee_privilege.granter,
        grantee: ctx.accounts.grantee_privilege.grantee,
    });

    Ok(())
}
