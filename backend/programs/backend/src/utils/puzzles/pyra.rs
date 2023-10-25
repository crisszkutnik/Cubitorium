use anchor_lang::prelude::*;
use bitstream_io::{BigEndian, BitWrite, BitWriter};

use crate::{
    error::{CompressionError, CubeError},
    utils::{huffman_compress_move, move_pyra_huffman, Puzzle},
};

/// Cube state
#[derive(Clone, Copy, Debug, AnchorDeserialize, AnchorSerialize)]
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
            ep: [1, 2, 3, 4, 5, 6],
            eo: [0; 6],
        }
    }

    /// Pyra::default() + moves
    /// Returns Huffman compressed moves (see [crate::utils::compression])
    pub fn from_moves(moves: &str) -> Result<(Pyra, Vec<u8>)> {
        let mut pyra: Pyra = Self::default();
        let compressed_moves = pyra.compress_and_apply(moves)?;

        Ok((pyra, compressed_moves))
    }

    /// Checks if the Pyra is solved
    pub fn is_solved(&self) -> Result<()> {
        if !(self.xo == [0, 0, 0, 0]
            && self.eo == [0, 0, 0, 0, 0, 0]
            && self.ep == [1, 2, 3, 4, 5, 6])
        {
            return Err(error!(CubeError::UnsolvedCube));
        }

        Ok(())
    }
}

impl Puzzle for Pyra {
    /// Compress given move sequence and apply it to the Pyraminx
    fn compress_and_apply(&mut self, moves: &str) -> Result<Vec<u8>> {
        let moves = moves.split_whitespace();

        let mut out = Vec::<u8>::new();
        let mut writer = BitWriter::endian(&mut out, BigEndian);

        // Transform move into Huffman representation and apply move to cube
        for m in moves {
            let (repr, size) = huffman_compress_move(m)?;

            writer
                .write(size, repr)
                .map_err(|_| CompressionError::CompressionError)?;

            move_pyra_huffman(repr, size, self)?;
        }

        // Pad with EOF sequence
        writer
            .write(7, 0b1110011)
            .map_err(|_| CompressionError::CompressionError)?;

        writer.into_unwritten();

        Ok(out)
    }

    fn check_solved_for_set(&self, _set: &str) -> Result<()> {
        self.is_solved()
    }
}
