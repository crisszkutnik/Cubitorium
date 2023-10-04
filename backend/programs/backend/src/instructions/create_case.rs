use anchor_lang::prelude::*;

use miniserde::json;

use crate::{state::*, constants::*, utils::*, error::{CubeError, CaseError, ConfigError, TreasuryError}};

#[derive(Accounts)]
#[instruction(set_name: String, id: String)]
pub struct CreateCase<'info> {
    /// Privileged user
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(seeds = [PRIVILEGE_TAG.as_ref(), signer.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    /// Program PDA treasury, funded by the community
    #[account(init_if_needed, payer = signer, space = 8, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    /// Case to be created
    #[account(
        init,
        seeds = [CASE_TAG.as_ref(), set_name.as_ref(), id.as_ref()], bump,
        space = Case::BASE_LEN + Case::extra_size_for_set(&set_name),
        payer = signer,
    )]
    pub case: Account<'info, Case>,

    #[account(seeds = [SET_TAG.as_ref(), set_name.as_ref()], bump)]
    pub set: Account<'info, Set>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateCase>,
    set_name: String,
    id: String,
    setup: String,
) -> Result<()> {
    require!(set_name.len() < MAX_SET_NAME_LENGTH, CaseError::MaxSetNameLength);
    require!(id.len() < MAX_CASE_ID_LENGTH, CaseError::MaxCaseIdLength);
    require!(setup.len() < MAX_SETUP_LENGTH, CaseError::MaxSetupLength);

    // Refund lamports
    let case_rent = ctx.accounts.rent.minimum_balance(Case::BASE_LEN + Case::extra_size_for_set(&set_name));
    require!(
        ctx.accounts.treasury.to_account_info().lamports() >= case_rent,
        TreasuryError::TreasuryNeedsFunds
    );
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= case_rent;
    **ctx.accounts.signer.try_borrow_mut_lamports()? += case_rent;

    // Check if case exists
    json::from_str::<Vec<String>>(&ctx.accounts.set.case_names)
        .map_err(|_| ConfigError::ConfigDeserializationError)?
        .iter().find(|case| case == &&id)
        .ok_or(CubeError::InvalidCase)?;


    // Write to PDA
    ctx.accounts.case.set = set_name.clone();
    ctx.accounts.case.id = id;
    ctx.accounts.case.setup = setup.clone();
    ctx.accounts.case.bump = *ctx.bumps.get("case").unwrap();

    // Code horror
    match &set_name[..] {
        "L4E" => {
            ctx.accounts.case.cube_state = None;
            ctx.accounts.case.pyra_state = Some(Pyra::from_moves(&setup)?);
        },
        _ => {
            ctx.accounts.case.cube_state = Some(Cube::from_moves(&setup)?);
            ctx.accounts.case.pyra_state = None;
        }
    }

    Ok(())
}
