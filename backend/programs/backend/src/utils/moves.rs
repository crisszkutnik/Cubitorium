//! Functions that interact with the cube's state

#![allow(non_snake_case)]

use anchor_lang::prelude::*;

use super::{Cube, Pyra};
use crate::{
    error::CubeError,
    move_def::{
        cube_move_def::*,
        pyra_move_def::{EO as P_EO, EP as P_EP, XO},
    },
};

/// Rotate four elements
pub fn apply_permutation(arr: &mut [u8], indices: [usize; 4]) -> () {
    // This was the easiest & fastest to think of option
    let last = arr[indices[3]];
    arr[indices[3]] = arr[indices[2]];
    arr[indices[2]] = arr[indices[1]];
    arr[indices[1]] = arr[indices[0]];
    arr[indices[0]] = last;
}

/// Rotate three elements
pub fn apply_permutation_3(arr: &mut [u8], indices: [usize; 3]) -> () {
    // This was the easiest & fastest to think of option
    let last = arr[indices[2]];
    arr[indices[2]] = arr[indices[1]];
    arr[indices[1]] = arr[indices[0]];
    arr[indices[0]] = last;
}

/// Apply orientation mask with modulo
pub fn apply_orientation(arr: &[u8], mask: &[u8], modulo: u8) -> Vec<u8> {
    arr.iter()
        .zip(mask)
        .map(|(&a, &b)| (a + b) % modulo)
        .collect()
}

/// Apply move to cube; modifies permutation of the 4 arrays
/// and orientation of the corresponding two (if needed)
pub fn apply_to_cube(
    mut cube: Cube,
    cp_indices: [usize; 4],
    ep_indices: [usize; 4],
    co_mask_opt: Option<[u8; 8]>,
    eo_mask_opt: Option<[u8; 12]>,
    xp_indices_opt: Option<[usize; 4]>,
) -> Cube {
    // Cycle all four arrays
    apply_permutation(&mut cube.co, cp_indices);
    apply_permutation(&mut cube.cp, cp_indices);
    apply_permutation(&mut cube.eo, ep_indices);
    apply_permutation(&mut cube.ep, ep_indices);

    // Update orientations if needed
    if let Some(co_mask) = co_mask_opt {
        cube.co = apply_orientation(&cube.co, &co_mask, 3).try_into().unwrap();
    }

    if let Some(eo_mask) = eo_mask_opt {
        cube.eo = apply_orientation(&cube.eo, &eo_mask, 2).try_into().unwrap();
    }

    // Update centers if needed
    if let Some(xp_indices) = xp_indices_opt {
        apply_permutation(&mut cube.xp, xp_indices);
    }

    cube
}

/// Apply move to Pyra; modifies permutation of both edge arrays
/// and orientation of centers (and edges if needed)
pub fn apply_to_pyra(
    mut pyra: Pyra,
    ep_indices: [usize; 3],
    xo_mask: [u8; 4],
    eo_mask_opt: Option<[u8; 6]>,
) -> Pyra {
    // Cycle both edge arrays
    apply_permutation_3(&mut pyra.eo, ep_indices);
    apply_permutation_3(&mut pyra.ep, ep_indices);

    // Update center orientation
    pyra.xo = apply_orientation(&pyra.xo, &xo_mask, 3).try_into().unwrap();

    // Update edge orientations if needed
    if let Some(eo_mask) = eo_mask_opt {
        pyra.eo = apply_orientation(&pyra.eo, &eo_mask, 2).try_into().unwrap();
    }

    pyra
}

/// Given a move, applies corresponding move to cube
pub fn move_cube(mov: usize, cube: &mut Cube) -> Result<()> {
    *cube = apply_to_cube(
        cube.clone(),
        *CP.get(mov).ok_or(CubeError::InvalidMove)?,
        *EP.get(mov).ok_or(CubeError::InvalidMove)?,
        *CO.get(mov).ok_or(CubeError::InvalidMove)?,
        *EO.get(mov).ok_or(CubeError::InvalidMove)?,
        *XP.get(mov).ok_or(CubeError::InvalidMove)?,
    );

    Ok(())
}

pub fn move_pyra(mov: usize, pyra: &mut Pyra) -> Result<()> {
    *pyra = apply_to_pyra(
        pyra.clone(),
        *P_EP.get(mov).ok_or(CubeError::InvalidMove)?,
        *XO.get(mov).ok_or(CubeError::InvalidMove)?,
        *P_EO.get(mov).ok_or(CubeError::InvalidMove)?,
    );

    Ok(())
}
