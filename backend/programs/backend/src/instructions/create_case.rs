use anchor_lang::prelude::*;

use crate::{state::*, constants::*, utils::*};

#[derive(Accounts)]
#[instruction(set: String, id: u32)]
pub struct CreateCase<'info> {
    /// Privileged user
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(seeds = [PRIVILEGE_TAG.as_ref(), user.key().as_ref()], bump = user_privilege.bump)]
    pub user_privilege: Account<'info, Privilege>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: SystemAccount<'info>,

    /// Case to be created
    #[account(
        init,
        seeds = [CASE_TAG.as_ref(), set.as_ref(), id.to_le_bytes().as_ref()], bump,
        space = Case::BASE_LEN,
        payer = treasury,
    )]
    pub case: Account<'info, Case>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateCase>,
    set: String,
    id: u32,
    setup: String,
) -> Result<()> {
    ctx.accounts.case.set = set;
    ctx.accounts.case.id = id;
    ctx.accounts.case.setup = setup;
    ctx.accounts.case.solutions = vec![];
    ctx.accounts.case.state = Cube::default(); // TODO: replace by actual state (compute it)
    ctx.accounts.case.bump = *ctx.bumps.get("case").unwrap();

    Ok(())
}
