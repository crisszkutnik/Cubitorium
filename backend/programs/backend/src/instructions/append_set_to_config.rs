use anchor_lang::prelude::*;

use std::collections::BTreeSet;

use miniserde::json;

use crate::{
    constants::*,
    error::{ConfigError, ContextError},
    state::*,
    utils::realloc_with_rent,
};

#[derive(Accounts)]
#[instruction(set_name: String, case_names: Vec<String>)]
pub struct AppendSetToConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), admin.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(mut, seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump)]
    pub global_config: Account<'info, GlobalConfig>,

    #[account(
        init,
        seeds = [SET_TAG.as_ref(), set_name.as_ref()],
        bump,
        payer = admin,
        space =
            Set::BASE_LEN +
            set_name.len() +
            2 + case_names.iter().fold(0, |acc, c| acc + c.len() + 3) - 1, // [] + " and , - trailing ,
    )]
    pub new_set: Option<Account<'info, Set>>,

    #[account(mut, seeds = [SET_TAG.as_ref(), set_name.as_ref()], bump)]
    pub existing_set: Option<Account<'info, Set>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<AppendSetToConfig>,
    set_name: String,
    case_names: Vec<String>,
) -> Result<()> {
    match (&mut ctx.accounts.existing_set, &mut ctx.accounts.new_set) {
        // First case: EXISTING SET
        (Some(set), None) => {
            // Deserialize and extend
            let mut current_case_names = BTreeSet::from_iter(
                json::from_str::<Vec<String>>(&set.case_names)
                    .map_err(|_| ConfigError::ConfigDeserializationError)?,
            );
            current_case_names.extend(case_names);

            // Serialize
            let new_case_names_json =
                json::to_string::<Vec<String>>(&current_case_names.into_iter().collect());

            // Realloc and write Set
            realloc_with_rent(
                Set::BASE_LEN + set_name.len() + new_case_names_json.len(),
                &mut set.to_account_info(),
                &ctx.accounts.admin.to_account_info(),
                &ctx.accounts.system_program.to_account_info(),
            )?;

            set.case_names = new_case_names_json;
        }

        // Second case: NEW SET
        (None, Some(set)) => {
            // Serialize and write Set
            set.set_name = set_name;
            set.case_names = json::to_string(&case_names);

            // Realloc and write GlobalConfig
            realloc_with_rent(
                ctx.accounts.global_config.to_account_info().data_len() + 32,
                &mut ctx.accounts.global_config.to_account_info(),
                &ctx.accounts.admin.to_account_info(),
                &ctx.accounts.system_program.to_account_info(),
            )?;

            ctx.accounts.global_config.sets.push(set.key());
        }

        // Everything else: FAIL
        (_, _) => err!(ContextError::MutuallyExclusiveAccounts)?,
    }

    Ok(())
}
