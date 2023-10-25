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
}

impl Solution {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH +
        32 + // case
        4  + // moves
        1  + // self_index
        32 + // author
        4  + // likes
        8    // timestamp
    ;
}

pub trait Hashable {
    fn hash_solution(&self) -> [u8; 32];
}

impl Hashable for String {
    fn hash_solution(&self) -> [u8; 32] {
        anchor_lang::solana_program::hash::hash(self.as_bytes()).to_bytes()
    }
}
