use anchor_lang::prelude::*;

use crate::error::UserInfoError;
use crate::UserInfo;

#[derive(Accounts)]
pub struct SendUserInfo<'info> {
    #[account(
        init,
        payer = user,
        space = UserInfo::LEN,
        seeds = [b"user-info", user.key().as_ref()],
        bump
    )]
    pub user_info: Account<'info, UserInfo>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SendUserInfo>, name: String, surname: String) -> Result<()> {
    if name.as_bytes().len() > 50 {
        err!(UserInfoError::UserNameTooLong)?;
    }

    if surname.as_bytes().len() > 50 {
        err!(UserInfoError::UserSurnameTooLong)?;
    }

    let user_info = &mut ctx.accounts.user_info;
    user_info.name = name;
    user_info.surname = surname;
    user_info.bump = *ctx.bumps.get("user_info").unwrap();

    Ok(())
}