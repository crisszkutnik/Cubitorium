use anchor_lang::prelude::*;

/// Cube state
#[derive(Clone, Debug, AnchorDeserialize, AnchorSerialize)]
pub struct Cube {
    /// Corner orientation vector
    pub co: [u8; 8],
    /// Corner permutation vector
    pub cp: [u8; 8],
    /// Edge orientation vector
    pub eo: [u8; 12],
    /// Edge permutation vector
    pub ep: [u8; 12],
}

impl Cube {
    pub const LEN: usize = 8 + 8 + 12 + 12;

    pub fn default() -> Cube {
        Cube {
            co: [0; 8],
            cp: [1,2,3,4,5,6,7,8],
            eo: [0; 12],
            ep: [1,2,3,4,5,6,7,8,9,10,11,12],
        }
    }
}
