use anchor_lang::prelude::*;

use crate::{state::*, constants::*};

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

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitGlobalConfig>, max_fund_limit: u64) -> Result<()> {
    ctx.accounts.global_config.sets = vec![];
    ctx.accounts.global_config.max_fund_limit = max_fund_limit;

    Ok(())
}
