/// Definition of Rubik's Cube moves (see paper)
/// 
/// Each letter is converted into index as a shifted ASCII value (-66) since RUFLDB are close:
/// B=66, D=68, F=70, L=76, R=82, U=85
/// B=0,  D=2,  F=4,  L=10, R=16, U=19
/// 
/// Later we store the definition for each move in its own index and the inverse in the next one
/// B'=1, D'=3, etc.
/// 

// Permutation vectors + Orientation masks

/// UBL UBR UFR UFL DFL DFR DBR DBL
pub static CP: &[[usize; 4]] = &[
    [7,6,1,0], // B
    [0,1,6,7], // inv
    [4,5,6,7], // D
    [7,6,5,4], // inv
    [2,5,4,3], // F
    [3,4,5,2], // inv
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [3,4,7,0], // L
    [0,7,4,3], // inv
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [6,5,2,1], // R
    [1,2,5,6], // inv
    [0,0,0,0], // fill
    [0,1,2,3], // U
    [3,2,1,0], // inv
];

/// UB UR UF UL BL BR FR FL DF DR DB DL
pub static EP: &[[usize; 4]] = &[
    [4,10,5,0],  // B
    [0,5,10,4],  // inv
    [8,9,10,11], // D
    [11,10,9,8], // inv
    [2,6,8,7],   // F
    [7,8,6,2],   // inv
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [3,7,11,4],  // L
    [4,11,7,3],  // inv
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [1,5,9,6],   // R
    [6,9,5,1],   // inv
    [0,0,0,0],   // fill
    [0,1,2,3],   // U
    [3,2,1,0],   // inv
];

/// 0 = none, 1 = cw, 2 = ccw
pub static CO: &[Option<[u8; 8]>] = &[
    Some([1,2,0,0,0,0,1,2]),    // B
    Some([1,2,0,0,0,0,1,2]),    // inv
    None,                       // D
    None,                       // inv
    Some([0,0,1,2,1,2,0,0]),    // F
    Some([0,0,1,2,1,2,0,0]),    // inv
    None,                       // fill
    None,                       // fill
    None,                       // fill
    None,                       // fill
    Some([2,0,0,1,2,0,0,1]),    // L
    Some([2,0,0,1,2,0,0,1]),    // inv
    None,                       // fill
    None,                       // fill
    None,                       // fill
    None,                       // fill
    Some([0,1,2,0,0,1,2,0]),    // R
    Some([0,1,2,0,0,1,2,0]),    // inv
    None,                       // fill
    None,                       // U
    None,                       // inv
];

/// 1 = unoriented
pub static EO: &[Option<[u8; 12]>] = &[
    Some([1,0,0,0,1,1,0,0,0,0,1,0]),    // B
    Some([1,0,0,0,1,1,0,0,0,0,1,0]),    // inv
    None,                               // D
    None,                               // inv
    Some([0,0,1,0,0,0,1,1,1,0,0,0]),    // F
    Some([0,0,1,0,0,0,1,1,1,0,0,0]),    // inv
    None,                               // fill
    None,                               // fill
    None,                               // fill
    None,                               // fill
    None,                               // L
    None,                               // inv
    None,                               // fill
    None,                               // fill
    None,                               // fill
    None,                               // fill
    None,                               // R
    None,                               // inv
    None,                               // fill
    None,                               // U
    None,                               // inv
];
