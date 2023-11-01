use anchor_lang::prelude::*;

use crate::{constants::*, error::UserInfoError, update_opt, utils::check_date, UserInfo};

#[derive(Accounts)]
pub struct SendUserInfo<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = UserInfo::LEN,
        seeds = [USER_INFO_TAG.as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_info: Account<'info, UserInfo>,

    pub system_program: Program<'info, System>,
}

pub fn send_user_info_handler(
    ctx: Context<SendUserInfo>,
    name: Option<String>,
    surname: Option<String>,
    wca_id: Option<String>,
    location: Option<String>,
    birthdate: Option<String>,
    profile_img_src: Option<String>,
) -> Result<()> {
    msg!("Creating user info...");

    let user_info = &mut ctx.accounts.user_info;

    update_opt!(
        user_info,
        name,
        MAX_NAME_LENGTH,
        UserInfoError::UserNameTooLong
    );
    update_opt!(
        user_info,
        surname,
        MAX_SURNAME_LENGTH,
        UserInfoError::UserSurnameTooLong
    );
    update_opt!(user_info, wca_id, WCA_ID_LENGTH, UserInfoError::WrongWCAID);
    update_opt!(
        user_info,
        location,
        MAX_LOCATION_LENGTH,
        UserInfoError::LocationTooLong
    );
    update_opt!(
        user_info,
        profile_img_src,
        MAX_URL_LEN,
        UserInfoError::ImgSrcTooLong
    );

    if let Some(_birthdate) = birthdate {
        check_date(&_birthdate)?;
        user_info.birthdate = _birthdate;
    }

    user_info.join_timestamp = Clock::get()?.unix_timestamp as u64;
    user_info.bump = ctx.bumps.user_info;

    Ok(())
}
