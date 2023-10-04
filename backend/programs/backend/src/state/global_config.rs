use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[account]
pub struct GlobalConfig {
    /// Supported sets (pointers)
    pub sets: Vec<Pubkey>,
}

impl GlobalConfig {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH + 4;
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
}

impl Set {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH + 4 + 4;
}
