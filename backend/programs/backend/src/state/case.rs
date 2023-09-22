use anchor_lang::prelude::*;
use crate::{utils::{Cube, Pyra}, constants::*};

#[repr(C)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Solution {
    pub author: Pubkey,
    pub likes: u32,
    pub timestamp: u64,
    pub moves: String,
}

/// Describes a solvable case
#[account]
pub struct Case {
    /// Set it belongs to (i.e. F2L, OLL)
    pub set: String,

    /// Identifier of this case
    pub id: String,

    /// Setup moves (ex. R U R' U')
    pub setup: String,

    /// Solutions for the case
    pub solutions: Vec<Solution>,

    /// Cube state of this case (after setup moves)
    /// Optional because Anchor can't handle modern programming
    pub cube_state: Option<Cube>,

    /// Pyra state of this case (after setup moves)
    /// Optional because Anchor can't handle modern programming
    pub pyra_state: Option<Pyra>,

    pub bump: u8,
}

impl Case {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH +
        MAX_SET_NAME_LENGTH +
        MAX_CASE_ID_LENGTH +
        MAX_SETUP_LENGTH +
        4 + // empty Vec<T>
        1 + // Option<Cube> and Option<Pyra> calculated dynamically in ix, but one will be None always
        1
    ;

    pub fn extra_size_for_set(set: &str) -> usize {
        1 + match set {
            "L4E" => Pyra::LEN,
            _ => Cube::LEN,
        }
    }
}
