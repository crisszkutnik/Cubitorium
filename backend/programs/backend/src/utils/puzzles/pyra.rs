use anchor_lang::prelude::*;

use std::{str::SplitWhitespace, borrow::BorrowMut};

use crate::error::CubeError;

use super::super::move_pyra;

/// Cube state
#[derive(Clone, Debug, AnchorDeserialize, AnchorSerialize)]
pub struct Pyra {
    /// Center orientation
    pub xo: [u8; 4],
    /// Edge permutation
    pub ep: [u8; 6],
    /// Edge orientation
    pub eo: [u8; 6],
}

impl Pyra {
    pub const LEN: usize = 4 + 6 + 6;

    /// Returns a solved Pyraminx
    pub fn default() -> Pyra {
        Pyra {
            xo: [0; 4],
            ep: [1,2,3,4,5,6],
            eo: [0; 6],
        }
    }

    /// Pyra::default() + apply_moves()
    pub fn from_moves(moves: &str) -> Result<Pyra> {
        let mut pyra: Pyra = Self::default();
        pyra.apply_moves(moves)?;

        Ok(pyra)
    }

    /// Given a "moves" string, apply to Pyra
    /// Example: moves = "R' U' L' U L"
    pub fn apply_moves(&mut self, moves: &str) -> Result<()> {
        // Iterate through every move and apply it if valid
        let moves: SplitWhitespace = moves.split_whitespace();
        for mov in moves {
            if ![
                    "R","U","L","B","R'","U'","L'","B'",
                    "R2","U2","L2","B2","R2'","U2'","L2'","B2'",
                ].contains(&mov) {
                return Err(error!(CubeError::InvalidMove));
            }

            // Letter into index (shifted ASCII value)
            // B=66, L=76, R=82, U=85
            // B=0,  L=10, R=16, U=19
            let base_move: usize = mov.chars().nth(0).unwrap() as usize - 66;
            
            match mov.chars().nth(1).is_some() {
                true => {
                    match mov.chars().nth(2).is_some() {
                        true => move_pyra(base_move, self.borrow_mut())?, // R2'
                        false => move_pyra(base_move + 1, self.borrow_mut())?, // R2 or R' (same for Pyra)
                    }
                },
                false => move_pyra(base_move, self.borrow_mut())?, // R
            }
        }

        Ok(())
    }

    /// Checks if the Pyra is solved
    pub fn is_solved(&self) -> Result<()> {
        if !(
            self.xo == [0,0,0,0] &&
            self.eo == [0,0,0,0,0,0] &&
            self.ep == [1,2,3,4,5,6]
        ) {
            return Err(error!(CubeError::UnsolvedCube));
        }
    
        Ok(())
    }
}
