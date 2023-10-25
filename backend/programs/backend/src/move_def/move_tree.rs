use crate::error::CompressionError;
use anchor_lang::prelude::*;
use bitstream_io::{BitRead, BitReader, Endianness};

///
/// Huffman tree that best compresses Rubik's Cube move sequences
/// Average of 3.1 bits per symbol, trained on example data in algs/
///
#[derive(Debug)]
pub struct Node {
    pub indices: &'static [usize],
    pub left: Option<&'static Node>,
    pub right: Option<&'static Node>,
}

impl Node {
    pub fn is_leaf(&self) -> bool {
        self.right.is_none() && self.left.is_none()
    }

    /// Traverses the tree as indicated by a path until it hits a leaf.
    pub fn traverse<R, E>(&self, path: &mut BitReader<R, E>) -> Result<Option<&Self>>
    where
        R: std::io::Read,
        E: Endianness,
    {
        if self.is_leaf() {
            return Ok(Some(self));
        }

        match path.read_bit() {
            Ok(bit) => {
                if bit {
                    match self.right {
                        Some(right) => right.traverse(path),
                        None => err!(CompressionError::InvalidTreePath)?,
                    }
                } else {
                    match self.left {
                        Some(left) => left.traverse(path),
                        None => err!(CompressionError::InvalidTreePath)?,
                    }
                }
            }
            Err(_) => Ok(None), // reader is exhausted
        }
    }
}

/// The TREE
/// BLESS MOTHER NATURE
pub static TREE: Node = Node {
    indices: &[],
    left: Some(&Node {
        indices: &[],
        left: Some(&Node {
            indices: &[0],
            left: None,
            right: None,
        }),
        right: Some(&Node {
            indices: &[1],
            left: None,
            right: None,
        }),
    }),
    right: Some(&Node {
        indices: &[],
        left: Some(&Node {
            indices: &[],
            left: Some(&Node {
                indices: &[5],
                left: None,
                right: None,
            }),
            right: Some(&Node {
                indices: &[],
                left: Some(&Node {
                    indices: &[],
                    left: Some(&Node {
                        indices: &[],
                        left: Some(&Node {
                            indices: &[],
                            left: Some(&Node {
                                indices: &[1, 12],
                                left: None,
                                right: None,
                            }),
                            right: Some(&Node {
                                indices: &[0, 13],
                                left: None,
                                right: None,
                            }),
                        }),
                        right: Some(&Node {
                            indices: &[8],
                            left: None,
                            right: None,
                        }),
                    }),
                    right: Some(&Node {
                        indices: &[11],
                        left: None,
                        right: None,
                    }),
                }),
                right: Some(&Node {
                    indices: &[5, 5],
                    left: None,
                    right: None,
                }),
            }),
        }),
        right: Some(&Node {
            indices: &[],
            left: Some(&Node {
                indices: &[4],
                left: None,
                right: None,
            }),
            right: Some(&Node {
                indices: &[],
                left: Some(&Node {
                    indices: &[],
                    left: Some(&Node {
                        indices: &[],
                        left: Some(&Node {
                            indices: &[9],
                            left: None,
                            right: None,
                        }),
                        right: Some(&Node {
                            indices: &[],
                            left: Some(&Node {
                                indices: &[],
                                left: Some(&Node {
                                    indices: &[],
                                    left: Some(&Node {
                                        indices: &[],
                                        left: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[0, 3, 13],
                                                left: None,
                                                right: None,
                                            }),
                                            right: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[4, 4, 8, 8, 14, 14],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[11, 6, 17],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                }),
                                                right: Some(&Node {
                                                    indices: &[10, 7, 16],
                                                    left: None,
                                                    right: None,
                                                }),
                                            }),
                                        }),
                                        right: Some(&Node {
                                            indices: &[3, 13],
                                            left: None,
                                            right: None,
                                        }),
                                    }),
                                    right: Some(&Node {
                                        indices: &[12],
                                        left: None,
                                        right: None,
                                    }),
                                }),
                                right: Some(&Node {
                                    indices: &[10, 10],
                                    left: None,
                                    right: None,
                                }),
                            }),
                            right: Some(&Node {
                                indices: &[],
                                left: Some(&Node {
                                    indices: &[],
                                    left: Some(&Node {
                                        indices: &[],
                                        left: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[6],
                                                left: None,
                                                right: None,
                                            }),
                                            right: Some(&Node {
                                                indices: &[7, 7],
                                                left: None,
                                                right: None,
                                            }),
                                        }),
                                        right: Some(&Node {
                                            indices: &[6, 6],
                                            left: None,
                                            right: None,
                                        }),
                                    }),
                                    right: Some(&Node {
                                        indices: &[],
                                        left: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[2, 2],
                                                    left: None,
                                                    right: None,
                                                }),
                                                right: Some(&Node {
                                                    indices: &[3, 3],
                                                    left: None,
                                                    right: None,
                                                }),
                                            }),
                                            right: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[1, 2, 12],
                                                    left: None,
                                                    right: None,
                                                }),
                                                right: Some(&Node {
                                                    indices: &[4, 9, 15],
                                                    left: None,
                                                    right: None,
                                                }),
                                            }),
                                        }),
                                        right: Some(&Node {
                                            indices: &[13],
                                            left: None,
                                            right: None,
                                        }),
                                    }),
                                }),
                                right: Some(&Node {
                                    indices: &[],
                                    left: Some(&Node {
                                        indices: &[],
                                        left: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[7],
                                                left: None,
                                                right: None,
                                            }),
                                            right: Some(&Node {
                                                indices: &[2, 12],
                                                left: None,
                                                right: None,
                                            }),
                                        }),
                                        right: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[10, 10, 6, 6, 16, 16],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[],
                                                        left: None,
                                                        right: Some(&Node {
                                                            indices: &[6, 17],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                }),
                                                right: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[7, 16],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[6, 6, 16, 16],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[8, 8],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[9, 15],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                }),
                                            }),
                                            right: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[8, 14],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[8, 8, 14, 14],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[14],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                }),
                                                right: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[15],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[14, 14],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[10, 10, 16, 16],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[2, 2, 12, 12],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                }),
                                            }),
                                        }),
                                    }),
                                    right: Some(&Node {
                                        indices: &[],
                                        left: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[10, 16],
                                                left: None,
                                                right: None,
                                            }),
                                            right: Some(&Node {
                                                indices: &[11, 17],
                                                left: None,
                                                right: None,
                                            }),
                                        }),
                                        right: Some(&Node {
                                            indices: &[],
                                            left: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[12, 12],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[16, 16],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[0, 0, 12, 12],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                }),
                                                right: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[16],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[17],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                }),
                                            }),
                                            right: Some(&Node {
                                                indices: &[],
                                                left: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[4, 15],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[5, 14],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                }),
                                                right: Some(&Node {
                                                    indices: &[],
                                                    left: Some(&Node {
                                                        indices: &[],
                                                        left: Some(&Node {
                                                            indices: &[4, 4, 14, 14],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                        right: Some(&Node {
                                                            indices: &[0, 0, 2, 2, 12, 12],
                                                            left: None,
                                                            right: None,
                                                        }),
                                                    }),
                                                    right: Some(&Node {
                                                        indices: &[5, 8, 14],
                                                        left: None,
                                                        right: None,
                                                    }),
                                                }),
                                            }),
                                        }),
                                    }),
                                }),
                            }),
                        }),
                    }),
                    right: Some(&Node {
                        indices: &[1, 1],
                        left: None,
                        right: None,
                    }),
                }),
                right: Some(&Node {
                    indices: &[],
                    left: Some(&Node {
                        indices: &[],
                        left: Some(&Node {
                            indices: &[3],
                            left: None,
                            right: None,
                        }),
                        right: Some(&Node {
                            indices: &[2],
                            left: None,
                            right: None,
                        }),
                    }),
                    right: Some(&Node {
                        indices: &[],
                        left: Some(&Node {
                            indices: &[],
                            left: Some(&Node {
                                indices: &[0, 0],
                                left: None,
                                right: None,
                            }),
                            right: Some(&Node {
                                indices: &[4, 4],
                                left: None,
                                right: None,
                            }),
                        }),
                        right: Some(&Node {
                            indices: &[10],
                            left: None,
                            right: None,
                        }),
                    }),
                }),
            }),
        }),
    }),
};
