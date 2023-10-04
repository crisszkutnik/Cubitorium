use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct UserInfo {
    pub name: String,
    pub surname: String,
    pub wca_id: String,
    pub location: String,
    /// Accepted date format: yyyy-mm-dd
    pub birthdate: String,
    pub likes_received: u32,
    pub submitted_solutions: u32,
    pub join_timestamp: u64,
    pub profile_img_src: String,
    /// Number of SOL already funded by treasury on some operations
    pub sol_funded: u64,
    pub bump: u8,
}

impl UserInfo {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + STRING_LENGTH_PREFIX + MAX_NAME_LENGTH
        + STRING_LENGTH_PREFIX + MAX_SURNAME_LENGTH
        + STRING_LENGTH_PREFIX + WCA_ID_LENGTH
        + STRING_LENGTH_PREFIX + MAX_LOCATION_LENGTH
        + STRING_LENGTH_PREFIX + DATE_LENGTH
        + 2 * 4 // two u32s
        + 1 * 8 // one u64
        + STRING_LENGTH_PREFIX + MAX_URL_LEN
        + 1 * 8 // one u64
        + BUMP_LENGTH;
}
