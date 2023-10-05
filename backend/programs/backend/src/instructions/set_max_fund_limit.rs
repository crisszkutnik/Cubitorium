use anchor_lang::prelude::*;

use crate::{state::*, constants::*};

#[derive(Accounts)]
pub struct SetMaxFundLimit<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), admin.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(mut, seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump)]
    pub global_config: Account<'info, GlobalConfig>,
}

pub fn handler(ctx: Context<SetMaxFundLimit>, new_max_fund_limit: u64) -> Result<()> {   
    ctx.accounts.global_config.max_fund_limit = new_max_fund_limit;

    Ok(())
}
