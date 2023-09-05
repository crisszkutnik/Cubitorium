use anchor_lang::prelude::*;
use crate::{utils::Cube, constants::*};

/// Describes a solvable case
#[account]
pub struct Case {
    /// Set it belongs to (i.e. F2L, OLL)
    pub set: String,

    /// Identifier of this case
    pub id: u32,

    /// Setup moves (ex. R U R' U')
    pub setup: String,

    /// Solutions for the case
    pub solutions: Vec<String>,

    /// Cube state of this case (after setup moves)
    pub state: Cube,

    pub bump: u8,
}

impl Case {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH +
        MAX_SET_NAME_LENGTH +
        4 + // u32
        MAX_SETUP_LENGTH +
        4 + // empty Vec<T>
        Cube::LEN +
        1
    ;
}
