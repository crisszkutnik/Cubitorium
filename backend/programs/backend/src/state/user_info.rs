use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct UserInfo {
    pub bump: u8,
    pub name: String,
    pub surname: String,
    pub wca_id: String,
    pub location: String,
}

impl UserInfo {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + BUMP_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_NAME_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_SURNAME_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_WCA_ID_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_LOCATION_LENGTH;
}

pub fn name_is_valid(name: &String) -> bool {
    return name.as_bytes().len() <= MAX_NAME_LENGTH;
}

pub fn surname_is_valid(surname: &String) -> bool {
    return surname.as_bytes().len() <= MAX_SURNAME_LENGTH;
}

pub fn wca_id_is_valid(wca_id: &String) -> bool {
    return wca_id.as_bytes().len() <= MAX_WCA_ID_LENGTH;
}

pub fn location_is_valid(location: &String) -> bool {
    return location.as_bytes().len() <= MAX_LOCATION_LENGTH;
}
