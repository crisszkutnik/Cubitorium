use anchor_lang::prelude::*;

#[account]
pub struct Treasury {
    pub bump: u8,
}

impl Treasury {
    pub const LEN: usize = 8 + 1;
}
