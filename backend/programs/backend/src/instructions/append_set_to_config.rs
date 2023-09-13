use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};

use crate::{state::*, constants::*, error::ConfigError};

#[derive(Accounts)]
pub struct AppendSetToConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(seeds = [PRIVILEGE_TAG.as_ref(), admin.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(
        mut,
        seeds = [GLOBAL_CONFIG_TAG.as_ref()],
        bump,
    )]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<AppendSetToConfig>, set_name: String, case_names: Vec<String>) -> Result<()> {
    // Deserialize JSON, edit, serialize JSON. Sorry
    
    let mut current_config = serde_json
        ::from_str::<ConfigCaseJson>(&ctx.accounts.global_config.sets_json)
        .map_err(|_| ConfigError::ConfigDeserializationError)
        .unwrap();

    current_config.push(
        CaseJson {
            set_name,
            case_names,
        }
    );

    let new_config_string = serde_json
        ::to_string(&current_config)
        .map_err(|_| ConfigError::ConfigSerializationError)
        .unwrap();

    // Transfer enough Rent + realloc PDA

    let rent = Rent::get()?;
    let new_size: usize = DISCRIMINATOR_LENGTH + 4 + new_config_string.len();
    let new_minimum_balance = rent.minimum_balance(new_size);

    let lamports_diff = new_minimum_balance.saturating_sub(ctx.accounts.global_config.to_account_info().lamports());
    invoke(
        &system_instruction::transfer(
            ctx.accounts.admin.key,
            &ctx.accounts.global_config.key(),
            lamports_diff
        ),
        &[
            ctx.accounts.admin.to_account_info(),
            ctx.accounts.global_config.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    ctx.accounts.global_config
        .to_account_info()
        .realloc(new_size, false)?;

    // Store in PDA
    ctx.accounts.global_config.sets_json = new_config_string;

    Ok(())
}
