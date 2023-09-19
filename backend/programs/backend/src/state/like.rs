use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[account]
pub struct Like {
    /// User who liked
    pub user: Pubkey,
    /// Case that has been liked
    pub case: Pubkey,
    /// Index of solution that has been liked
    pub solution_index: u8,
}

impl Like {
    pub const LEN: usize = 
        DISCRIMINATOR_LENGTH +
        32 + // user
        32 + // case
        1    // solution_index
    ;
}
