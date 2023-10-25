use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct SetLearningStatus<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: no seeds check because it can be any solution
    /// Solution that is being removed its like
    #[account(mut)]
    pub solution_pda: Account<'info, Solution>,

    /// Like certificates also store learning status
    #[account(
        mut,
        seeds = [
            LIKE_CERTIFICATE_TAG.as_ref(),
            signer.key().as_ref(),
            solution_pda.key().as_ref()
        ],
        bump,
    )]
    pub like_certificate: Account<'info, LikeCertificate>,
}

pub fn set_learning_status_handler(
    ctx: Context<SetLearningStatus>,
    status: LearningStatus,
) -> Result<()> {
    // Set learning status
    ctx.accounts.like_certificate.learning_status = status;

    Ok(())
}
