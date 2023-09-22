use anchor_lang::prelude::*;

use crate::utils::{Cube, Pyra};

pub fn validate_set_setup_solution(set: &str, setup: &str, solution: &str) -> Result<()> {
    match set {
        "L4E" => {
            let mut pyra: Pyra = Pyra::from_moves(setup)?;
            pyra.apply_moves(solution)?;
            pyra.is_solved()?;
        },
        _ => {
            let mut cube: Cube = Cube::from_moves(setup)?;
            cube.apply_moves(solution)?;
            cube.check_solved_for_set(set)?;
        }
    }

    Ok(())
}
