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
        add_privileged_user::add_privileged_user_handler(ctx)
    }

    /// Revoke existing privilege (only privileged user)
    pub fn revoke_privilege(ctx: Context<RevokePrivilege>, revoked_user: Pubkey) -> Result<()> {
        revoke_privilege::revoke_privilege_handler(ctx, revoked_user)
    }

    /// Init global config PDA
    pub fn init_global_config(ctx: Context<InitGlobalConfig>, max_fund_limit: u64) -> Result<()> {
        init_global_config::init_global_config_handler(ctx, max_fund_limit)
    }

    /// Sets max fund limit
    pub fn set_max_fund_limit(
        ctx: Context<SetMaxFundLimit>,
        new_max_fund_limit: u64,
    ) -> Result<()> {
        set_max_fund_limit::set_max_fund_limit_handler(ctx, new_max_fund_limit)
    }

    /// Appends new set with its cases to global config
    pub fn append_set_to_config(
        ctx: Context<AppendSetToConfig>,
        set_name: String,
        case_names: Vec<String>,
    ) -> Result<()> {
        append_set_to_config::append_set_to_config_handler(ctx, set_name, case_names)
    }

    /// Removes set with its cases from global config
    pub fn remove_set_from_config(
        ctx: Context<RemoveSetFromConfig>,
        set_name: String,
    ) -> Result<()> {
        remove_set_from_config::remove_set_from_config_handler(ctx, set_name)
    }

    //////////// Case handling ////////////

    /// Creates a case (only privileged user)
    pub fn create_case(
        ctx: Context<CreateCase>,
        set_name: String,
        id: String,
        setup: String,
    ) -> Result<()> {
        create_case::create_case_handler(ctx, set_name, id, setup)
    }

    /// Add a solution to a case (permissionless)
    pub fn add_solution(ctx: Context<AddSolution>, solution: String) -> Result<()> {
        add_solution::add_solution_handler(ctx, solution)
    }

    /// Adds a like to a solution or changes existing like (user)
    /// A user can only like one solution per case
    pub fn like_solution(ctx: Context<LikeSolution>) -> Result<()> {
        like_solution::like_solution_handler(ctx)
    }

    /// Removes a like from a solution entirely (user)
    pub fn remove_like(ctx: Context<RemoveLike>) -> Result<()> {
        remove_like::remove_like_handler(ctx)
    }

    /// Sets learning status. Needs to like solution first
    pub fn set_learning_status(
        ctx: Context<SetLearningStatus>,
        status: LearningStatus,
    ) -> Result<()> {
        set_learning_status::set_learning_status_handler(ctx, status)
    }

    //////////// User profiles ////////////

    /// Initializes user info PDA (user)
    pub fn send_user_info(
        ctx: Context<SendUserInfo>,
        name: Option<String>,
        surname: Option<String>,
        wca_id: Option<String>,
        location: Option<String>,
        birthdate: Option<String>,
        profile_img_src: Option<String>,
    ) -> Result<()> {
        send_user_info::send_user_info_handler(
            ctx,
            name,
            surname,
            wca_id,
            location,
            birthdate,
            profile_img_src,
        )
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
        change_user_info::change_user_info_handler(
            ctx,
            new_name,
            new_surname,
            new_wca_id,
            new_location,
            new_birthdate,
            new_profile_img_src,
        )
    }
}
