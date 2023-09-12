use anchor_lang::prelude::*;

use crate::{constants::*, state::*, utils::Cube};

#[derive(Accounts)]
#[instruction(solution: String)]
pub struct AddSolution<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    /// CHECK: no seeds needed because it can be any case
    #[account(
        mut,
        realloc = case.to_account_info().data_len() + solution.len(),
        realloc::payer = signer,
        realloc::zero = false,
    )]
    pub case: Account<'info, Case>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<AddSolution>, solution: String) -> Result<()> {
    // Refund extra rent
    let extra_rent = ctx.accounts.rent.minimum_balance(solution.len());
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= extra_rent;
    **ctx.accounts.signer.try_borrow_mut_lamports()? += extra_rent;

    // Check that solution works (setup + solution = solved)
    let mut cube: Cube = Cube::from_moves(ctx.accounts.case.setup.clone())?;
    cube.apply_moves(solution.clone())?;
    cube.is_solved()?;

    // TODO: different sets have different checks. Add that later

    ctx.accounts.case.solutions.push(solution);

    Ok(())
}
