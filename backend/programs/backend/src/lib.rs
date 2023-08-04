use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

pub use crate::{instructions::*, state::*};

declare_id!("13YVuPAdZDTe1xssYDwTg6ndGFhhSMv3tZxh8s2wyZMA");

#[program]
pub mod backend {
    use super::*;

    pub fn send_user_info(ctx: Context<SendUserInfo>, name: String, surname: String) -> Result<()> {
        send_user_info::handler(ctx, name, surname)
    }

    pub fn change_user_info(
        ctx: Context<ChangeUserInfo>,
        new_name: String,
        new_surname: String,
    ) -> Result<()> {
        change_user_info::handler(ctx, new_name, new_surname)
    }
}
