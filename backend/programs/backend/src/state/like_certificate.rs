use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[repr(u8)]
#[derive(AnchorDeserialize, AnchorSerialize, Clone, Debug)]
pub enum LearningStatus {
    NotLearnt = 0,
    Learning,
    Learnt,
}

/// PDA used to register a like of a user to avoid double liking of a case
#[account]
pub struct LikeCertificate {
    pub learning_status: LearningStatus,
    pub user: Pubkey,
    pub solution: Pubkey,
    pub bump: u8,
}

impl LikeCertificate {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + 1 + 32 + 32 + 1;
}
