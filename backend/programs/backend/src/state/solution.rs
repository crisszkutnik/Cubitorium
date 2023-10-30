use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

#[account]
pub struct Solution {
    /// Case this solution solves
    pub case: Pubkey,
    /// Actual solution (compressed, see [crate::utils::compression])
    pub moves: Vec<u8>,
    /// Index within the virtual solution array for the case
    pub self_index: u8,
    /// Signer of the add_solution() instruction
    pub author: Pubkey,
    /// Number of user who liked this solution
    pub likes: u32,
    /// Unix timestamp of submission
    pub timestamp: u64,
    pub bump: u8,
}

impl Solution {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH +
        32 + // case
        4  + // moves
        1  + // self_index
        32 + // author
        4  + // likes
        8  + // timestamp
        1    // bump
    ;
}

pub trait Hashable {
    fn hash_solution(&self) -> [u8; 32];
}

impl Hashable for String {
    fn hash_solution(&self) -> [u8; 32] {
        // Every x2' move is equivalent to their x2 sibling and is therefore
        // compressed with the same encoding. Nonetheless, some x2' moves are
        // an exception to this rule and they are the ones that are valid in Pyraminx.
        // So we will need to clean the string to transform 2' to 2 unless it's a Pyra move.
        let clean_string = self
            .replace("R2'", "R2p")
            .replace("L2'", "L2p")
            .replace("U2'", "U2p")
            .replace("B2'", "B2p")
            .replace("2'", "2")
            .replace("R2p", "R2'")
            .replace("L2p", "L2'")
            .replace("U2p", "U2'")
            .replace("B2p", "B2'");

        anchor_lang::solana_program::hash::hash(clean_string.as_bytes()).to_bytes()
    }
}
