use anchor_lang::prelude::*;
use bitstream_io::{BigEndian, BitWrite, BitWriter};

use crate::{
    error::{CompressionError, CubeError},
    utils::{huffman_compress_move, move_cube_huffman, Puzzle},
};

/// Cube state
#[derive(Clone, Copy, Debug, AnchorDeserialize, AnchorSerialize)]
pub struct Cube {
    /// Corner orientation vector
    pub co: [u8; 8],
    /// Corner permutation vector
    pub cp: [u8; 8],
    /// Edge orientation vector
    pub eo: [u8; 12],
    /// Edge permutation vector
    pub ep: [u8; 12],
    /// Center position vector
    pub xp: [u8; 6],
}

impl Cube {
    pub const LEN: usize = 8 + 8 + 12 + 12 + 6;

    /// Returns a solved Cube
    pub const fn default() -> Cube {
        Cube {
            co: [0; 8],
            cp: [1, 2, 3, 4, 5, 6, 7, 8],
            eo: [0; 12],
            ep: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            xp: [1, 2, 3, 4, 5, 6],
        }
    }

    /// Cube::default() + moves
    /// Returns Huffman compressed moves (see [crate::utils::compression])
    pub fn from_moves(moves: &str) -> Result<(Cube, Vec<u8>)> {
        let mut cube: Cube = Self::default();
        let compressed_moves = cube.compress_and_apply(moves)?;

        Ok((cube, compressed_moves))
    }

    /// Checks if the Cube is solved
    pub fn is_solved(&self) -> Result<()> {
        if !(self.co == [0, 0, 0, 0, 0, 0, 0, 0]
            && self.cp == [1, 2, 3, 4, 5, 6, 7, 8]
            && self.eo == [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            && self.ep == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            && self.xp == [1, 2, 3, 4, 5, 6])
        {
            return Err(error!(CubeError::UnsolvedCube));
        }

        Ok(())
    }

    /// Checks if the OLL is solved (F2L solved + oriented last layer)
    pub fn is_oll_solved(&self) -> Result<()> {
        if !(self.co == [0, 0, 0, 0, 0, 0, 0, 0]
            && self.cp[4..8] == [5, 6, 7, 8]
            && self.eo == [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            && self.ep[4..12] == [5, 6, 7, 8, 9, 10, 11, 12]
            && self.xp == [1, 2, 3, 4, 5, 6])
        {
            return Err(error!(CubeError::UnsolvedCube));
        }

        Ok(())
    }

    /// Checks if the F2L is solved (first two layers)
    pub fn is_f2l_solved(&self) -> Result<()> {
        if !(self.co[4..8] == [0, 0, 0, 0]
            && self.cp[4..8] == [5, 6, 7, 8]
            && self.eo[4..12] == [0, 0, 0, 0, 0, 0, 0, 0]
            && self.ep[4..12] == [5, 6, 7, 8, 9, 10, 11, 12]
            && self.xp == [1, 2, 3, 4, 5, 6])
        {
            return Err(error!(CubeError::UnsolvedCube));
        }

        Ok(())
    }

    /// Checks if the CMLL is solved (first two blocks + corners)
    pub fn is_cmll_solved(&self) -> Result<()> {
        if !(self.co == [0, 0, 0, 0, 0, 0, 0, 0]
            && self.cp == [1, 2, 3, 4, 5, 6, 7, 8]
            && self.eo[4..8] == [0, 0, 0, 0]
            && self.eo[9] == 0
            && self.eo[11] == 0
            && self.ep[4..8] == [5, 6, 7, 8]
            && self.ep[9] == 10
            && self.ep[11] == 12
            && self.xp[2] == 3
            && self.xp[4] == 5)
        {
            return Err(error!(CubeError::UnsolvedCube));
        }

        Ok(())
    }

    /// Checks only if corners are solved (good for 2x2x2)
    pub fn are_corners_solved(&self) -> Result<()> {
        if !(self.co == [0, 0, 0, 0, 0, 0, 0, 0] && self.cp == [1, 2, 3, 4, 5, 6, 7, 8]) {
            return Err(error!(CubeError::UnsolvedCube));
        }

        Ok(())
    }
}

impl Puzzle for Cube {
    /// Compress given move sequence and apply it to the Cube
    fn compress_and_apply(&mut self, movestr: &str) -> Result<Vec<u8>> {
        let moves = movestr.split_whitespace();

        let mut out = Vec::<u8>::new();
        let mut writer = BitWriter::endian(&mut out, BigEndian);

        // Transform move into Huffman representation and apply move to cube
        for m in moves {
            let (repr, size) = huffman_compress_move(m)?;

            writer
                .write(size, repr)
                .map_err(|_| CompressionError::CompressionError)?;

            move_cube_huffman(repr, size, self)?;
        }

        // Pad with EOF sequence
        writer
            .write(7, 0b1110011)
            .map_err(|_| CompressionError::CompressionError)?;

        writer.into_unwritten();

        msg!("Compressed {} into {:?}", movestr, out);

        Ok(out)
    }

    fn check_solved_for_set(&self, set: &str) -> Result<()> {
        if set.len() > 4 && &set[0..4] == "ZBLL" {
            self.is_solved()?;
            return Ok(());
        }

        match set {
            "F2L" => self.is_f2l_solved()?,
            "OLL" => self.is_oll_solved()?,
            "PLL" => self.is_solved()?,
            "CMLL" => self.is_cmll_solved()?,
            "CLL" => self.are_corners_solved()?,
            "EG-1" => self.are_corners_solved()?,
            "EG-2" => self.are_corners_solved()?,
            _ => return Err(error!(CubeError::UnsupportedSet)),
        }

        Ok(())
    }
}
