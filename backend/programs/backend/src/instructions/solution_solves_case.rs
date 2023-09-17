use anchor_lang::prelude::*;

use crate::{state::*, utils::Cube};

#[derive(Accounts)]
#[instruction(solution: String)]
pub struct SolutionSolvesCase<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: no seeds needed because it can be any case
    #[account()]
    pub case: Account<'info, Case>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<SolutionSolvesCase>, solution: String) -> Result<()> {
    // Check that solution works (setup + solution = solved state for its set)
    let mut cube: Cube = Cube::from_moves(&ctx.accounts.case.setup)?;
    cube.apply_moves(&solution)?;
    cube.check_solved_for_set(&ctx.accounts.case.set)?;

    Ok(())
}
