use anchor_lang::prelude::*;

use crate::error::UserInfoError;
use crate::{constants::*, name_is_valid, surname_is_valid, wca_id_is_valid};
use crate::{location_is_valid, UserInfo};

#[derive(Accounts)]
pub struct SendUserInfo<'info> {
    #[account(
        init,
        payer = user,
        space = UserInfo::LEN,
        seeds = [USER_INFO_TAG.as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_info: Account<'info, UserInfo>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<SendUserInfo>,
    name: String,
    surname: String,
    wca_id: String,
    location: String,
) -> Result<()> {
    if !name_is_valid(&name) {
        err!(UserInfoError::UserNameTooLong)?;
    }

    if !surname_is_valid(&surname) {
        err!(UserInfoError::UserSurnameTooLong)?;
    }

    if !wca_id_is_valid(&wca_id) {
        err!(UserInfoError::WCAIDTooLong)?;
    }

    if !location_is_valid(&location) {
        err!(UserInfoError::LocationTooLong)?;
    }

    let user_info = &mut ctx.accounts.user_info;
    user_info.name = name;
    user_info.surname = surname;
    user_info.wca_id = wca_id;
    user_info.location = location;
    user_info.bump = *ctx.bumps.get("user_info").unwrap();

    Ok(())
}
