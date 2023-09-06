use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[account]
pub struct GlobalConfig {
    pub sets_json: String,
}

impl GlobalConfig {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH;
}
