/// Definition of Rubik's Cube moves (see paper)
/// 
/// Each letter is converted into index as a shifted ASCII value (-66) since RUFLDB are close:
/// B=66, D=68, F=70, L=76, R=82, U=85
/// B=0,  D=2,  F=4,  L=10, R=16, U=19
/// 
/// Later we store the definition for each move in its own index and the inverse in the next one
/// B'=1, D'=3, etc.
/// 
/// Slice moves are shifted by -63 to find room for them and their inverse
/// E=69, M=77, S=83
/// E=6,  M=14, S=21
/// 

// Permutation vectors + Orientation masks

/// UBL UBR UFR UFL DFL DFR DBR DBL
pub static CP: &[[usize; 4]] = &[
    [7,6,1,0], // B
    [0,1,6,7], // B'
    [4,5,6,7], // D
    [7,6,5,4], // D'
    [2,5,4,3], // F
    [3,4,5,2], // F'
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [3,4,7,0], // L
    [0,7,4,3], // L'
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [6,5,2,1], // R
    [1,2,5,6], // R'
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,0,0,0], // fill
    [0,1,2,3], // U
    [3,2,1,0], // U'
];

/// UB UR UF UL BL BR FR FL DF DR DB DL
pub static EP: &[[usize; 4]] = &[
    [4,10,5,0],  // B
    [0,5,10,4],  // B'
    [8,9,10,11], // D
    [11,10,9,8], // D'
    [2,6,8,7],   // F
    [7,8,6,2],   // F'
    [7,6,5,4],   // E
    [4,5,6,7],   // E'
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [3,7,11,4],  // L
    [4,11,7,3],  // L'
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [0,2,8,10],  // M
    [10,8,2,0],  // M'
    [1,5,9,6],   // R
    [6,9,5,1],   // R'
    [0,0,0,0],   // fill
    [0,0,0,0],   // fill
    [1,9,11,3],  // S
    [3,11,9,1],  // S'
    [0,1,2,3],   // U
    [3,2,1,0],   // U'
];

/// 0 = none, 1 = cw, 2 = ccw
pub static CO: &[Option<[u8; 8]>] = &[
    Some([1,2,0,0,0,0,1,2]),    // B
    Some([1,2,0,0,0,0,1,2]),    // B'
    None,                       // D
    None,                       // D'
    Some([0,0,1,2,1,2,0,0]),    // F
    Some([0,0,1,2,1,2,0,0]),    // F'
    None,                       // fill
    None,                       // fill
    None,                       // fill
    None,                       // fill
    Some([2,0,0,1,2,0,0,1]),    // L
    Some([2,0,0,1,2,0,0,1]),    // L'
    None,                       // fill
    None,                       // fill
    None,                       // fill
    None,                       // fill
    Some([0,1,2,0,0,1,2,0]),    // R
    Some([0,1,2,0,0,1,2,0]),    // R'
    None,                       // fill
    None,                       // fill
    None,                       // fill
    None,                       // fill
    None,                       // U
    None,                       // U'
];

/// 1 = unoriented
pub static EO: &[Option<[u8; 12]>] = &[
    Some([1,0,0,0,1,1,0,0,0,0,1,0]),    // B
    Some([1,0,0,0,1,1,0,0,0,0,1,0]),    // B'
    None,                               // D
    None,                               // D'
    Some([0,0,1,0,0,0,1,1,1,0,0,0]),    // F
    Some([0,0,1,0,0,0,1,1,1,0,0,0]),    // F'
    Some([0,0,0,0,1,1,1,1,0,0,0,0]),    // E
    Some([0,0,0,0,1,1,1,1,0,0,0,0]),    // E'
    None,                               // fill
    None,                               // fill
    None,                               // L
    None,                               // L'
    None,                               // fill
    None,                               // fill
    Some([1,0,1,0,0,0,0,0,1,0,1,0]),    // M
    Some([1,0,1,0,0,0,0,0,1,0,1,0]),    // M'
    None,                               // R
    None,                               // R'
    None,                               // fill
    None,                               // fill
    Some([0,1,0,1,0,0,0,0,0,1,0,1]),    // S
    Some([0,1,0,1,0,0,0,0,0,1,0,1]),    // S'
    None,                               // U
    None,                               // U'
];

/// U B R F L D
pub static XP: &[Option<[usize; 4]>] = &[
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    Some([4,3,2,1]), // E
    Some([1,2,3,4]), // E'
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    Some([0,3,5,1]), // M
    Some([1,5,3,0]), // M'
    None,            // fill
    None,            // fill
    None,            // fill
    None,            // fill
    Some([0,2,5,4]), // S
    Some([4,5,2,0]), // S'
    None,            // fill
    None,            // fill
];
