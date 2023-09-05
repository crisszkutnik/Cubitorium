use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct UserInfo {
    pub bump: u8,
    pub name: String,
    pub surname: String,
}

impl UserInfo {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + BUMP_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_NAME_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_SURNAME_LENGTH;
}
