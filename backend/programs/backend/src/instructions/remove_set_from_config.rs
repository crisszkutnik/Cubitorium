use anchor_lang::prelude::*;

use crate::{state::*, constants::*};

#[derive(Accounts)]
#[instruction(set_name: String)]
pub struct RemoveSetFromConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), admin.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(mut, seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump = global_config.bump)]
    pub global_config: Account<'info, GlobalConfig>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        seeds = [SET_TAG.as_ref(), set_name.as_ref()], bump = set.bump,
        close = treasury
    )]
    pub set: Account<'info, Set>,
}

#[event]
pub struct RemoveSetFromConfigEvent {
    set_name: String
}

pub fn remove_set_from_config_handler(ctx: Context<RemoveSetFromConfig>, set_name: String) -> Result<()> {
    msg!("Removed set {} from global config...", set_name);

    // Remove set from GlobalConfig vector
    ctx.accounts.global_config.sets = ctx.accounts.global_config.sets
        .clone()
        .into_iter()
        .filter(|set| *set != ctx.accounts.set.key())
        .collect();
    
    emit!(RemoveSetFromConfigEvent { set_name });

    Ok(())
}
