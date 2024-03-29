use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[account]
pub struct GlobalConfig {
    pub max_fund_limit: u64,
    /// Supported sets (pointers)
    pub sets: Vec<Pubkey>,
    pub bump: u8,
}

impl GlobalConfig {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH + 8 + 4 + 1;
}

#[account]
pub struct Set {
    /// Set name
    pub set_name: String,
    /// Case names as serialized JSON
    ///
    /// Example:
    ///
    /// `["Aa","Ab","E","F"]`
    ///
    pub case_names: String,
    pub bump: u8,
}

impl Set {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH + 4 + 4 + 1;
}
