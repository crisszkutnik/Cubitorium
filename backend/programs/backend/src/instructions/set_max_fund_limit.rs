use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct SetMaxFundLimit<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), admin.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(mut, seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump = global_config.bump)]
    pub global_config: Account<'info, GlobalConfig>,
}

#[event]
pub struct SetMaxFundLimitEvent {
    pub new_max_fund_limit: u64,
}

pub fn set_max_fund_limit_handler(
    ctx: Context<SetMaxFundLimit>,
    new_max_fund_limit: u64,
) -> Result<()> {
    msg!("Setting max fund limit to {}...", new_max_fund_limit);

    ctx.accounts.global_config.max_fund_limit = new_max_fund_limit;

    emit!(SetMaxFundLimitEvent { new_max_fund_limit });

    Ok(())
}
