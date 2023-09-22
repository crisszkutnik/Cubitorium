use anchor_lang::prelude::*;

use std::{borrow::BorrowMut, str::SplitWhitespace};

use crate::error::CubeError;

use super::super::move_cube;

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

    /// Returns a solved Cube
    pub fn default() -> Cube {
        Cube {
            co: [0; 8],
            cp: [1,2,3,4,5,6,7,8],
            eo: [0; 12],
            ep: [1,2,3,4,5,6,7,8,9,10,11,12],
        }
    }

    /// Cube::default() + apply_moves()
    pub fn from_moves(moves: &str) -> Result<Cube> {
        let mut cube: Cube = Self::default();
        cube.apply_moves(moves)?;

        Ok(cube)
    }

    /// Given a "moves" string, apply to cube
    /// Example: moves = "R' U' F R U R2 D"
    pub fn apply_moves(&mut self, moves: &str) -> Result<()> {
        // Iterate through every move and apply it if valid
        let moves: SplitWhitespace = moves.split_whitespace();
        for mov in moves {
            if ![
                "R","U","F","L","D","B",
                "R'","U'","F'","L'","D'","B'",
                "R2","U2","F2","L2","D2","B2",
            ].contains(&mov) {
                return Err(error!(CubeError::InvalidMove));
            }

            // Letter into index (shifted ASCII value)
            // B=66, D=68, F=70, L=76, R=82, U=85
            // B=0,  D=2,  F=4,  L=10, R=16, U=19
            let base_move: usize = mov.chars().nth(0).unwrap() as usize - 66;
            // Direction
            if let Some(dir) = mov.chars().nth(1) {
                match dir {
                    '\'' => move_cube(base_move + 1, self.borrow_mut()),
                    '2' => {
                        move_cube(base_move, self.borrow_mut());
                        move_cube(base_move, self.borrow_mut());
                    },
                    _ => (),
                }
            }
            else {
                move_cube(base_move, self.borrow_mut());
            }
        }

        Ok(())
    }

    /// Checks if the Cube is solved
    pub fn is_solved(&self) -> Result<()> {
        if !(
            self.co == [0,0,0,0,0,0,0,0] &&
            self.cp == [1,2,3,4,5,6,7,8] &&
            self.eo == [0,0,0,0,0,0,0,0,0,0,0,0] &&
            self.ep == [1,2,3,4,5,6,7,8,9,10,11,12]
        ) {
            return Err(error!(CubeError::UnsolvedCube));
        }
    
        Ok(())
    }

    /// Checks if the OLL is solved (F2L solved + oriented last layer)
    pub fn is_oll_solved(&self) -> Result<()> {
        if !(
            self.co        == [0,0,0,0,0,0,0,0] &&
            self.cp[4..8]  == [5,6,7,8] &&
            self.eo        == [0,0,0,0,0,0,0,0,0,0,0,0] &&
            self.ep[4..12] == [5,6,7,8,9,10,11,12]
        ) {
            return Err(error!(CubeError::UnsolvedCube));
        }
    
        Ok(())
    }

    /// Checks if the F2L is solved (first two layers)
    pub fn is_f2l_solved(&self) -> Result<()> {
        if !(
            self.co[4..8]  == [0,0,0,0] &&
            self.cp[4..8]  == [5,6,7,8] &&
            self.eo[4..12] == [0,0,0,0,0,0,0,0] &&
            self.ep[4..12] == [5,6,7,8,9,10,11,12]
        ) {
            return Err(error!(CubeError::UnsolvedCube));
        }
    
        Ok(())
    }

    /// Checks if the CMLL is solved (first two blocks + corners)
    pub fn is_cmll_solved(&self) -> Result<()> {
        if !(
            self.co        == [0,0,0,0,0,0,0,0] &&
            self.cp        == [1,2,3,4,5,6,7,8] &&
            self.eo[4..8]  == [0,0,0,0] &&
            self.eo[9]     == 0 &&
            self.eo[11]    == 0 &&
            self.ep[4..8]  == [5,6,7,8] &&
            self.ep[9]     == 10 &&
            self.ep[11]    == 12
        ) {
            return Err(error!(CubeError::UnsolvedCube));
        }
    
        Ok(())
    }

    /// Checks only if corners are solved (good for 2x2x2)
    pub fn are_corners_solved(&self) -> Result<()> {
        if !(
            self.co == [0,0,0,0,0,0,0,0] &&
            self.cp == [1,2,3,4,5,6,7,8]
        ) {
            return Err(error!(CubeError::UnsolvedCube));
        }
    
        Ok(())
    }

    pub fn check_solved_for_set(&self, set: &str) -> Result<()> {
        match set {
            "F2L" => self.is_f2l_solved()?,
            "OLL" => self.is_oll_solved()?,
            "PLL" => self.is_solved()?,
            "ZBLL" => self.is_solved()?,
            "CMLL" => self.is_cmll_solved()?,
            "CLL" => self.are_corners_solved()?,
            "EG-1" => self.are_corners_solved()?,
            "EG-2" => self.are_corners_solved()?,
            _ => return Err(error!(CubeError::UnsupportedSet))
        }

        Ok(())
    }
}
