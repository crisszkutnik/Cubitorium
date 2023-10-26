use anchor_lang::prelude::*;

use miniserde::json;

use crate::{
    constants::*,
    error::{CaseError, ConfigError, CubeError},
    state::*,
    utils::*,
};

#[derive(Accounts)]
#[instruction(set_name: String, id: String)]
pub struct CreateCase<'info> {
    /// Privileged user
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(seeds = [PRIVILEGE_TAG.as_ref(), signer.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    #[account(mut, seeds = [USER_INFO_TAG.as_ref(), signer.key().as_ref()], bump = user_profile.bump)]
    pub user_profile: Account<'info, UserInfo>,

    /// Program PDA treasury, funded by the community
    #[account(
        init_if_needed,
        seeds = [TREASURY_TAG.as_ref()], bump,
        payer = signer,
        space = Treasury::LEN
    )]
    pub treasury: Account<'info, Treasury>,

    /// Case to be created
    #[account(
        init,
        seeds = [CASE_TAG.as_ref(), set_name.as_ref(), id.as_ref()], bump,
        space = Case::BASE_LEN,
        payer = signer,
    )]
    pub case: Account<'info, Case>,

    #[account(seeds = [SET_TAG.as_ref(), set_name.as_ref()], bump = set.bump)]
    pub set: Account<'info, Set>,

    #[account(seeds = [GLOBAL_CONFIG_TAG.as_ref()], bump = global_config.bump)]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_case_handler(
    ctx: Context<CreateCase>,
    set_name: String,
    id: String,
    setup: String,
) -> Result<()> {
    msg!("Creating case {}:{} with moves {}...", set_name, id, setup);

    require!(
        set_name.len() < MAX_SET_NAME_LENGTH,
        CaseError::MaxSetNameLength
    );
    require!(id.len() < MAX_CASE_ID_LENGTH, CaseError::MaxCaseIdLength);
    require!(setup.len() < MAX_SETUP_LENGTH, CaseError::MaxSetupLength);

    // Check if case exists
    json::from_str::<Vec<String>>(&ctx.accounts.set.case_names)
        .map_err(|_| ConfigError::ConfigDeserializationError)?
        .iter()
        .find(|case| case == &&id)
        .ok_or(CubeError::InvalidCase)?;

    // Compress setup and compute puzzle state
    ctx.accounts.case.set = set_name;
    let compressed_setup = ctx.accounts.case.set_puzzle_state_and_compress(&setup)?;

    // Allocate extra size for cube state and setup
    let case_len = Case::BASE_LEN + ctx.accounts.case.extra_size() + compressed_setup.len();
    ctx.accounts
        .case
        .to_account_info()
        .realloc(case_len, false)?;

    // Pay and refund rent
    let refund_amount = ctx.accounts.case.to_account_info().lamports();
    let extra_amount = ctx
        .accounts
        .rent
        .minimum_balance(case_len)
        .saturating_sub(refund_amount);

    pay_rent_and_refund_to_user(
        refund_amount,
        extra_amount,
        ctx.accounts.global_config.max_fund_limit,
        ctx.accounts
            .treasury
            .to_account_info()
            .try_borrow_mut_lamports()?,
        ctx.accounts
            .case
            .to_account_info()
            .try_borrow_mut_lamports()?,
        ctx.accounts.signer.try_borrow_mut_lamports()?,
        &mut ctx.accounts.user_profile,
    )?;

    // Write remaining fields to PDA
    ctx.accounts.case.id = id;
    ctx.accounts.case.setup = compressed_setup;
    ctx.accounts.case.bump = ctx.bumps.case;

    // Treasury bump
    ctx.accounts.treasury.bump = ctx.bumps.treasury;

    Ok(())
}
