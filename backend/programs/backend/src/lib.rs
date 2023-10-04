use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod move_def;
pub mod state;
pub mod utils;

pub use crate::{instructions::*, state::*};

declare_id!("EDhKz6TfaLMzZpFB5dSdyGeLHT6TppjGdyPc8Vn1QyNq");

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

    /// Init global config PDA
    pub fn init_global_config(ctx: Context<InitGlobalConfig>, max_fund_limit: u64) -> Result<()> {
        init_global_config::handler(ctx, max_fund_limit)
    }

    /// Sets max fund limit
    pub fn set_max_fund_limit(ctx: Context<SetMaxFundLimit>, new_max_fund_limit: u64) -> Result<()> {
        set_max_fund_limit::handler(ctx, new_max_fund_limit)
    }

    /// Appends new set with its cases to global config
    pub fn append_set_to_config(
        ctx: Context<AppendSetToConfig>,
        set_name: String,
        case_names: Vec<String>,
    ) -> Result<()> {
        append_set_to_config::handler(ctx, set_name, case_names)
    }

    //////////// Case handling ////////////

    /// Creates a case (only privileged user)
    pub fn create_case(
        ctx: Context<CreateCase>,
        set_name: String,
        id: String,
        setup: String,
    ) -> Result<()> {
        create_case::handler(ctx, set_name, id, setup)
    }

    /// Add a solution to a case (permissionless)
    pub fn add_solution(ctx: Context<AddSolution>, solution: String) -> Result<()> {
        add_solution::handler(ctx, solution)
    }

    /// Adds a like to a solution or changes existing like (user)
    /// A user can only like one solution per case
    pub fn like_solution(ctx: Context<LikeSolution>) -> Result<()> {
        like_solution::handler(ctx)
    }

    /// Removes a like from a solution entirely (user)
    pub fn remove_like(ctx: Context<RemoveLike>) -> Result<()> {
        remove_like::handler(ctx)
    }

    /// Sets learning status. Needs to like solution first
    pub fn set_learning_status(
        ctx: Context<SetLearningStatus>,
        status: LearningStatus,
    ) -> Result<()> {
        set_learning_status::handler(ctx, status)
    }

    //////////// User profiles ////////////

    /// Initializes user info PDA (user)
    pub fn send_user_info(
        ctx: Context<SendUserInfo>,
        name: String,
        surname: String,
        wca_id: String,
        location: String,
        birthdate: String,
        profile_img_src: String,
    ) -> Result<()> {
        send_user_info::handler(ctx, name, surname, wca_id, location, birthdate, profile_img_src)
    }

    /// Modifies existing user info PDA (user)
    pub fn change_user_info(
        ctx: Context<ChangeUserInfo>,
        new_name: Option<String>,
        new_surname: Option<String>,
        new_wca_id: Option<String>,
        new_location: Option<String>,
        new_birthdate: Option<String>,
        new_profile_img_src: Option<String>,
    ) -> Result<()> {
        change_user_info::handler(ctx, new_name, new_surname, new_wca_id, new_location, new_birthdate, new_profile_img_src)
    }
}
