use anchor_lang::prelude::*;

#[error_code]
pub enum UserInfoError {
    #[msg("User name too long")]
    UserNameTooLong,

    #[msg("User surname too long")]
    UserSurnameTooLong,

    #[msg("WCA ID too long")]
    WCAIDTooLong,

    #[msg("Location too long")]
    LocationTooLong,
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

    #[msg("The set is invalid. Contact an admin")]
    InvalidSet,

    #[msg("The case does not exist in this set")]
    InvalidCase,
}

#[error_code]
pub enum ConfigError {
    #[msg("Could not deserialize existing config. Mayhem!")]
    ConfigDeserializationError,

    #[msg("Could not serialize existing config. Mayhem!")]
    ConfigSerializationError,
}
