use anchor_lang::prelude::*;

use crate::state::Like;

pub fn is_liked(like: &Account<Like>) -> bool {
    like.user != Pubkey::default()
}
