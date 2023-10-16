use anchor_lang::prelude::*;

use crate::{
    error::CubeError,
    utils::{Cube, Pyra},
};

pub fn validate_set_setup_solution(set: &str, setup: &str, solution: &str) -> Result<()> {
    match set {
        "L4E" => {
            let mut pyra: Pyra = Pyra::from_moves(setup)?;
            pyra.apply_moves(solution)?;
            pyra.is_solved()?;
        }
        _ => {
            let mut cube: Cube = Cube::from_moves(setup)?;
            cube.apply_moves(solution)?;
            cube.check_solved_for_set(set)?;
        }
    }

    Ok(())
}

/// Converts i.e Bw to S' (it is applied as B S') in [crate::cube.rs])
/// B =0,  D=2, F=4,  L=10,  R =16, U=22
/// S'=21, E=6, S=20, M=14,  M'=15, E'=7
pub fn wide_to_slice(base_move: usize) -> Result<usize> {
    match base_move {
        0 => Ok(21),
        2 => Ok(6),
        4 => Ok(20),
        10 => Ok(14),
        16 => Ok(15),
        22 => Ok(7),
        _ => err!(CubeError::InvalidMove)?,
    }
}

pub fn opp_slice(base_move: usize) -> Result<usize> {
    match base_move {
        6 => Ok(7),
        7 => Ok(6),
        14 => Ok(15),
        15 => Ok(14),
        20 => Ok(21),
        21 => Ok(20),
        _ => err!(CubeError::InvalidMove)?,
    }
}
