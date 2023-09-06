use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use crate::{instructions::*, state::*};

declare_id!("8ptgSjCeuciKorgFjNhE1kpFrSnG2s5A1gEBBcczgVGH");

#[program]
pub mod backend {
    use super::*;

    //////////// Privileged users ////////////

    /// Adds a new privileged user (only privileged user)
    pub fn add_privileged_user(ctx: Context<AddPrivilegedUser>) -> Result<()> {
        add_privileged_user::handler(ctx)
    }

    /// Revoke existing privilege (only privileged user)
    pub fn revoke_privilege(ctx: Context<RevokePrivilege>, revoked_user: Pubkey) -> Result<()> {
        revoke_privilege::handler(ctx, revoked_user)
    }

    //////////// Case handling ////////////

    /// Creates a case (only privileged user)
    pub fn create_case(
        ctx: Context<CreateCase>,
        set: String,
        id: u32,
        setup: String,
    ) -> Result<()> {
        create_case::handler(ctx, set, id, setup)
    }

    /// Add a solution to a case (permissionless)
    pub fn add_solution(ctx: Context<AddSolution>, solution: String) -> Result<()> {
        add_solution::handler(ctx, solution)
    }

    //////////// User profiles ////////////

    /// Initializes user info PDA (user)
    pub fn send_user_info(ctx: Context<SendUserInfo>, name: String, surname: String) -> Result<()> {
        send_user_info::handler(ctx, name, surname)
    }

    /// Modifies existing user info PDA (user)
    pub fn change_user_info(
        ctx: Context<ChangeUserInfo>,
        new_name: String,
        new_surname: String,
    ) -> Result<()> {
        change_user_info::handler(ctx, new_name, new_surname)
    }
}
