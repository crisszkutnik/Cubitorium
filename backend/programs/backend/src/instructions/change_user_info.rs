use anchor_lang::prelude::*;

use crate::error::UserInfoError;
use crate::UserInfo;

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

pub fn handler(ctx: Context<ChangeUserInfo>, new_name: String, new_surname: String) -> Result<()> {
    if new_name.as_bytes().len() > 50 {
        err!(UserInfoError::UserNameTooLong)?;
    }

    if new_surname.as_bytes().len() > 50 {
        err!(UserInfoError::UserSurnameTooLong)?;
    }

    ctx.accounts.user_info.name = new_name;
    ctx.accounts.user_info.surname = new_surname;

    Ok(())
}
