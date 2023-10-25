/// Definition of the Pyraminx (see [cube_move_def.rs])
///
/// Each letter is converted into index as a transformed ASCII value (x-66) since RULB are close:
/// B=66, L=76, R=82, U=85
/// B=0,  L=10, R=16, U=19
///
/// Later we store the definition for each move in its own index and the inverse in the next one
/// B'=1, L'=11, etc.
///

/// RL FR FL DF DR DL
pub static EP: &[[usize; 3]] = &[
    [1, 4, 3], // R
    [1, 3, 4], // R'
    [2, 3, 5], // L
    [2, 5, 3], // L'
    [0, 1, 2], // U
    [0, 2, 1], // U'
    [5, 4, 0], // B
    [4, 5, 0], // B'
];

/// 1 = unoriented
pub static EO: &[Option<[u8; 6]>] = &[
    Some([0, 1, 0, 0, 1, 0]), // R
    Some([0, 1, 0, 1, 0, 0]), // R'
    Some([0, 0, 1, 1, 0, 0]), // L
    Some([0, 0, 1, 0, 0, 1]), // L'
    None,                     // U
    None,                     // U'
    Some([1, 0, 0, 0, 0, 1]), // B
    Some([1, 0, 0, 0, 1, 0]), // B'
];

/// U L R B
pub static XO: &[[u8; 4]] = &[
    [0, 0, 1, 0], // R
    [0, 0, 2, 0], // R'
    [0, 1, 0, 0], // L
    [0, 2, 0, 0], // L'
    [1, 0, 0, 0], // U
    [2, 0, 0, 0], // U'
    [0, 0, 0, 1], // B
    [0, 0, 0, 2], // B'
];
