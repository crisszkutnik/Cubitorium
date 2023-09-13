//! Functions that interact with the cube's state

#![allow(non_snake_case)]

use crate::cube_move_def::*;
use super::Cube;

/// Rotate four elements
pub fn apply_permutation(arr: &mut [u8], indices: [usize; 4]) -> () {
    // This was the easiest & fastest to think of option
    let last    = arr[indices[3]];
    arr[indices[3]] = arr[indices[2]];
    arr[indices[2]] = arr[indices[1]];
    arr[indices[1]] = arr[indices[0]];
    arr[indices[0]] = last;
}

/// Apply orientation mask with modulo
pub fn apply_orientation(arr: &[u8], mask: &[u8], modulo: u8) -> Vec<u8> {
    arr
        .iter()
        .zip(mask)
        .map(|(&a,&b)| (a+b) % modulo)
        .collect()
}

/// Apply move to cube; modifies permutation of the 4 arrays
/// and orientation of the corresponding two (if needed)
pub fn apply_to_cube(
    mut cube: Cube,
    cp_indices: [usize; 4],
    ep_indices: [usize; 4],
    co_mask_opt: Option<[u8; 8]>,
    eo_mask_opt: Option<[u8; 12]>
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

    cube
}

/// Given a move, applies corresponding move to cube
pub fn move_cube(mov: usize, cube: &mut Cube) {
    *cube = apply_to_cube(
        cube.clone(),
        CP[mov],
        EP[mov],
        CO[mov],
        EO[mov],
    );
}
