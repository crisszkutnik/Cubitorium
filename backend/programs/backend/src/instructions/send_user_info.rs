use anchor_lang::prelude::*;

use crate::{constants::*, error::UserInfoError, utils::check_date, UserInfo};

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

pub fn handler(
    ctx: Context<SendUserInfo>,
    name: String,
    surname: String,
    wca_id: String,
    location: String,
    birthdate: String,
    profile_img_src: String,
) -> Result<()> {
    require!(
        name.len() <= MAX_NAME_LENGTH,
        UserInfoError::UserNameTooLong
    );
    require!(
        surname.len() <= MAX_SURNAME_LENGTH,
        UserInfoError::UserSurnameTooLong
    );
    require!(wca_id.len() <= WCA_ID_LENGTH, UserInfoError::WrongWCAID);
    require!(
        location.len() <= MAX_LOCATION_LENGTH,
        UserInfoError::LocationTooLong
    );
    require!(
        profile_img_src.len() <= MAX_URL_LEN,
        UserInfoError::ImgSrcTooLong
    );
    check_date(&birthdate)?;

    let user_info = &mut ctx.accounts.user_info;
    user_info.name = name;
    user_info.surname = surname;
    user_info.wca_id = wca_id;
    user_info.location = location;
    user_info.birthdate = birthdate;
    user_info.join_timestamp = Clock::get()?.unix_timestamp as u64;
    user_info.profile_img_src = profile_img_src;
    user_info.bump = *ctx.bumps.get("user_info").unwrap();

    Ok(())
}
