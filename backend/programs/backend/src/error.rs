use anchor_lang::prelude::*;

#[error_code]
pub enum UserInfoError {
    #[msg("User name too long")]
    UserNameTooLong,

    #[msg("User surname too long")]
    UserSurnameTooLong,

    #[msg("WCA ID must be YYYYXXXXYY")]
    WrongWCAID,

    #[msg("Location too long")]
    LocationTooLong,

    #[msg("Date must be yyyy-mm-dd")]
    WrongDateFormat,

    #[msg("Profile image URL exceeded max length")]
    ImgSrcTooLong,
}

#[error_code]
pub enum PrivilegeError {
    #[msg("Account doesn't have the corresponding privileges for this action")]
    PrivilegeEscalation,
}

#[error_code]
pub enum TreasuryError {
    #[msg("Treasury is broke, please fund it in order to perform this action")]
    TreasuryNeedsFunds,
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

    #[msg("The given set is not supported yet (validator code missing)")]
    UnsupportedSet,

    #[msg("Fatal error validating the puzzle state")]
    FatalError,
}

#[error_code]
pub enum ConfigError {
    #[msg("Could not deserialize existing config. Mayhem!")]
    ConfigDeserializationError,

    #[msg("Could not serialize existing config. Mayhem!")]
    ConfigSerializationError,
}

#[error_code]
pub enum LikeError {
    #[msg("User has already liked this case")]
    AlreadyLiked,

    #[msg("The given solution doesn't exist for the given case")]
    SolutionDoesntExist,
}

#[error_code]
pub enum CaseError {
    #[msg("Case has over MAX_SOLUTIONS_ALLOWED solutions.")]
    MaxSolutionsAllowed,

    #[msg("Set name too long")]
    MaxSetNameLength,

    #[msg("Case id too long")]
    MaxCaseIdLength,

    #[msg("Setup length too long")]
    MaxSetupLength,

    #[msg("Catastrophic failure - world has ended")]
    Cataclysm,
}

#[error_code]
pub enum ContextError {
    #[msg("Only one of the optional accounts can be provided")]
    MutuallyExclusiveAccounts,
}

#[error_code]
pub enum CompressionError {
    #[msg("Error in string compression")]
    CompressionError,

    #[msg("Error while moving cube during compression. Should be unreachable. Sorry if this happened.")]
    MovingDuringCompressionError,

    #[msg("Invalid path travelling the tree")]
    InvalidTreePath,
}
