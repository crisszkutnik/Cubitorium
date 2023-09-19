use anchor_lang::prelude::*;

use crate::{constants::*, state::*, error::{LikeError, CaseError}, utils::is_liked};

#[derive(Accounts)]
#[instruction(solution: String)]
pub struct LikeSolution<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Program PDA treasury, funded by the community
    #[account(mut, seeds = [TREASURY_TAG.as_ref()], bump)]
    pub treasury: Account<'info, Treasury>,

    /// CHECK: no seeds needed because it can be any case
    #[account(mut)]
    pub case: Account<'info, Case>,

    #[account(
        init_if_needed,
        seeds = [LIKE_TAG.as_ref(), signer.key().as_ref(), case.key().as_ref()],
        bump,
        payer = signer,
        space = Like::LEN,
    )]
    pub like: Account<'info, Like>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<LikeSolution>, solution: String) -> Result<()> {
    // Find index of solution
    let new_index = match ctx.accounts.case.solutions.iter().position(|sol| sol.moves == solution) {
        Some(_index) => _index,
        None => return Err(error!(LikeError::SolutionDoesntExist)),
    };

    if is_liked(&ctx.accounts.like) {
        // Remove like to old solution unless it's the same (reject to save fee)
        require!(ctx.accounts.like.solution_index != new_index as u8, LikeError::AlreadyLiked);

        let prev_liked_sol = ctx.accounts.case.solutions
            .get_mut(ctx.accounts.like.solution_index as usize)
            .ok_or(CaseError::Cataclysm)?;

        prev_liked_sol.likes -= 1;
    }
    
    // Add like to solution array in Case PDA
    let sol_to_like = ctx.accounts.case.solutions.get_mut(new_index).unwrap();
    sol_to_like.likes += 1;

    // Update Like PDA data
    ctx.accounts.like.user = ctx.accounts.signer.key();
    ctx.accounts.like.case = ctx.accounts.case.key();
    ctx.accounts.like.solution_index = new_index as u8;

    Ok(())
}
