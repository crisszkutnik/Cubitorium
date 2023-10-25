use crate::{
    constants::*,
    error::CubeError,
    utils::{Cube, Puzzle, Pyra},
};
use anchor_lang::prelude::*;

/// Describes a solvable case
#[account]
pub struct Case {
    /// Set it belongs to (i.e. F2L, OLL)
    pub set: String,

    /// Identifier of this case
    pub id: String,

    /// Setup moves (ex. R U R' U') (compressed, see [crate::utils::compression])
    pub setup: Vec<u8>,

    /// Cube state of this case (after setup moves)
    /// Optional because Anchor can't handle modern programming
    pub cube_state: Option<Cube>,

    /// Pyra state of this case (after setup moves)
    /// Optional because Anchor can't handle modern programming
    pub pyra_state: Option<Pyra>,

    /// Number of solutions it has
    pub solutions: u8,

    pub bump: u8,
}

impl Case {
    pub const BASE_LEN: usize = DISCRIMINATOR_LENGTH +
        MAX_SET_NAME_LENGTH +
        MAX_CASE_ID_LENGTH +
        4 + // Vec<u8> calculated dynamically in ix
        1 + // Option<Cube> and Option<Pyra> calculated dynamically in ix, but one will be None always
        1 + // solutions
        1   // bump
    ;

    /// Extra needed size based on the set name, for Option<Cube> or Option<Pyra>
    pub fn extra_size(&self) -> usize {
        1 + match &self.set[..] {
            "L4E" => Pyra::LEN,
            _ => Cube::LEN,
        }
    }

    /// Return cube_state or pyra_state as a generic type
    pub fn get_puzzle(&self) -> Result<Box<dyn Puzzle>> {
        match (self.cube_state, self.pyra_state) {
            (Some(cube), None) => Ok(Box::new(cube)),
            (None, Some(pyra)) => Ok(Box::new(pyra)),
            _ => err!(CubeError::FatalError)?,
        }
    }

    /// Checks that a given solution works for this set, and returns it Huffman compressed (see [crate::utils::compression])
    pub fn validate_and_compress_solution(&mut self, solution: &str) -> Result<Vec<u8>> {
        let mut puzzle = self.get_puzzle()?;

        let compressed = puzzle.compress_and_apply(solution)?;

        puzzle.check_solved_for_set(&self.set)?;

        Ok(compressed)
    }

    /// Set the case puzzle state through a setup and return it Huffman compressed (see [crate::utils::compression])
    pub fn set_puzzle_state_and_compress(&mut self, setup: &str) -> Result<Vec<u8>> {
        Ok(match &self.set[..] {
            "L4E" => {
                let (pyra, compressed) = Pyra::from_moves(&setup)?;

                self.cube_state = None;
                self.pyra_state = Some(pyra);

                compressed
            }
            _ => {
                let (cube, compressed) = Cube::from_moves(&setup)?;

                self.cube_state = Some(cube);
                self.pyra_state = None;

                compressed
            }
        })
    }
}
