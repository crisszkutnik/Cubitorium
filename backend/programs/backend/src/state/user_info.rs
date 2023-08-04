use anchor_lang::prelude::*;

#[account]
pub struct UserInfo {
    pub bump: u8,
    pub name: String,
    pub surname: String,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const BUMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;
const MAX_NAME_LENGTH: usize = 50 * 4;
const MAX_SURNAME_LENGTH: usize = 50 * 4;

impl UserInfo {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + BUMP_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_NAME_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_SURNAME_LENGTH;
}
