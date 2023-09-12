use anchor_lang::prelude::*;

#[error_code]
pub enum UserInfoError {
    #[msg("User name too long")]
    UserNameTooLong,

    #[msg("User surname too long")]
    UserSurnameTooLong,
}

#[error_code]
pub enum PrivilegeError {
    #[msg("Account doesn't have the corresponding privileges for this action")]
    PrivilegeEscalation,
}

#[error_code]
pub enum CubeError {
    #[msg("Cube is not solved for the required subset")]
    UnsolvedCube,

    #[msg("Some given move is not valid as per WCA notation")]
    InvalidMove,
}
