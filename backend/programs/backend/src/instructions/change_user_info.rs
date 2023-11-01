use anchor_lang::prelude::*;

use crate::{constants::*, error::UserInfoError, utils::check_date, UserInfo};

#[derive(Accounts)]
pub struct ChangeUserInfo<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-info", user.key().as_ref()],
        bump = user_info.bump
    )]
    pub user_info: Account<'info, UserInfo>,
}

#[macro_export]
macro_rules! update_opt {
    ($acc:ident, $field:ident, $max_len:ident, $err:expr) => {
        if let Some(f) = $field {
            if f.len() > $max_len {
                return Err(error!($err));
            }
            $acc.$field = f;
        }
    };
}

pub fn change_user_info_handler(
    ctx: Context<ChangeUserInfo>,
    name: Option<String>,
    surname: Option<String>,
    wca_id: Option<String>,
    location: Option<String>,
    birthdate: Option<String>,
    profile_img_src: Option<String>,
) -> Result<()> {
    msg!("Updating user info...");

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

    Ok(())
}
