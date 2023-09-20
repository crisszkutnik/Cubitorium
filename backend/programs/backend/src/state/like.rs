use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[repr(u8)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum LearningStatus {
    NotLearnt = 0, // evil
    Learning,
    Learnt,
}

#[account]
pub struct Like {
    /// User who liked
    pub user: Pubkey,
    /// Case that has been liked
    pub case: Pubkey,
    /// Index of solution that has been liked
    pub solution_index: u8,
    /// Learning status
    pub learning_status: LearningStatus,
}

impl Like {
    pub const LEN: usize = 
        DISCRIMINATOR_LENGTH +
        32 + // user
        32 + // case
        1  + // solution_index
        1    // learning_status
    ;
}
