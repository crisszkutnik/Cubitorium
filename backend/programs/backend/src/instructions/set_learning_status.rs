use anchor_lang::prelude::*;

use crate::{constants::*, state::*, error::LikeError};

#[derive(Accounts)]
pub struct SetLearningStatus<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: no seeds needed because it can be any case
    pub case: Account<'info, Case>,

    #[account(mut, seeds = [LIKE_TAG.as_ref(), signer.key().as_ref(), case.key().as_ref()], bump)]
    pub like: Account<'info, Like>,
}

pub fn handler(ctx: Context<SetLearningStatus>, status: LearningStatus) -> Result<()> {
    if let None = ctx.accounts.case.solutions.get(ctx.accounts.like.solution_index as usize) {
        err!(LikeError::SolutionDoesntExist)?;
    }

    ctx.accounts.like.learning_status = status;

    Ok(())
}
