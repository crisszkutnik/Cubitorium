use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct InitGlobalConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), admin.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(
        init,
        seeds = [GLOBAL_CONFIG_TAG.as_ref()],
        bump,
        payer = admin,
        space = GlobalConfig::BASE_LEN + 4
    )]
    pub global_config: Account<'info, GlobalConfig>,

    /// Program PDA treasury, funded by the community
    #[account(init_if_needed, seeds = [TREASURY_TAG.as_ref()], bump, space = 8+1, payer = admin)]
    pub treasury: Account<'info, Treasury>,

    pub system_program: Program<'info, System>,
}

pub fn init_global_config_handler(
    ctx: Context<InitGlobalConfig>,
    max_fund_limit: u64,
) -> Result<()> {
    msg!("Initializing global config...");

    ctx.accounts.global_config.sets = vec![];
    ctx.accounts.global_config.max_fund_limit = max_fund_limit;
    ctx.accounts.global_config.bump = ctx.bumps.global_config;

    ctx.accounts.treasury.bump = ctx.bumps.treasury;

    Ok(())
}
