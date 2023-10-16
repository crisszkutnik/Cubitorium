use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_LENGTH;

/// PDA to identify privileged accounts
#[account]
pub struct Privilege {
    /// Granted by
    pub granter: Pubkey,

    /// Granted to
    pub grantee: Pubkey,

    pub bump: u8,
}

impl Privilege {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + 32 + 32 + 1;
}
