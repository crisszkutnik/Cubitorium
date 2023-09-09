use anchor_lang::prelude::*;

use crate::error::UserInfoError;
use crate::{location_is_valid, UserInfo};
use crate::{name_is_valid, surname_is_valid, wca_id_is_valid};

#[derive(Accounts)]
pub struct ChangeUserInfo<'info> {
    pub user: Signer<'info>,

    #[account(
      mut,
      seeds = [b"user-info", user.key().as_ref()],
      bump = user_info.bump
    )]
    pub user_info: Account<'info, UserInfo>,
}

pub fn handler(
    ctx: Context<ChangeUserInfo>,
    new_name: String,
    new_surname: String,
    new_wca_id: String,
    new_location: String,
) -> Result<()> {
    if !name_is_valid(&new_name) {
        err!(UserInfoError::UserNameTooLong)?;
    }

    if !surname_is_valid(&new_surname) {
        err!(UserInfoError::UserSurnameTooLong)?;
    }

    if !wca_id_is_valid(&new_wca_id) {
        err!(UserInfoError::WCAIDTooLong)?;
    }

    if !location_is_valid(&new_location) {
        err!(UserInfoError::LocationTooLong)?;
    }

    let user_info = &mut ctx.accounts.user_info;

    user_info.name = new_name;
    user_info.surname = new_surname;
    user_info.wca_id = new_wca_id;
    user_info.location = new_location;

    Ok(())
}
