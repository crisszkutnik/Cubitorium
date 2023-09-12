use anchor_lang::prelude::*;

use crate::{state::*, constants::*, utils::*};

#[derive(Accounts)]
#[instruction(set: String, id: u32)]
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
        seeds = [CASE_TAG.as_ref(), set.as_ref(), id.to_le_bytes().as_ref()], bump,
        space = Case::BASE_LEN,
        payer = signer,
    )]
    pub case: Account<'info, Case>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateCase>,
    set: String,
    id: u32,
    setup: String,
) -> Result<()> {
    // Refund lamports
    let case_rent = ctx.accounts.rent.minimum_balance(Case::BASE_LEN);
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= case_rent;
    **ctx.accounts.signer.try_borrow_mut_lamports()? += case_rent;

    // Write to PDA
    ctx.accounts.case.set = set;
    ctx.accounts.case.id = id;
    ctx.accounts.case.setup = setup.clone();
    ctx.accounts.case.solutions = vec![];
    ctx.accounts.case.state = Cube::from_moves(setup)?;
    ctx.accounts.case.bump = *ctx.bumps.get("case").unwrap();

    Ok(())
}
