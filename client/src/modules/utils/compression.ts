type Node = {
  tag: string;
  left?: Node;
  right?: Node;
};

/**
 * Huffman tree to encode/decode compressed move sequences
 *
 * 11100111010010 is EOF
 *
 */
const TREE: Node = {
  tag: '',
  left: {
    tag: '',
    left: {
      tag: 'R',
    },
    right: {
      tag: "R'",
    },
  },
  right: {
    tag: '',
    left: {
      tag: '',
      left: {
        tag: "U'",
      },
      right: {
        tag: '',
        left: {
          tag: '',
          left: {
            tag: '',
            left: {
              tag: '',
              left: {
                tag: "Rw'",
              },
              right: {
                tag: 'Rw',
              },
            },
            right: {
              tag: 'D',
            },
          },
          right: {
            tag: "F'",
          },
        },
        right: {
          tag: "U2'",
        },
      },
    },
    right: {
      tag: '',
      left: {
        tag: 'U',
      },
      right: {
        tag: '',
        left: {
          tag: '',
          left: {
            tag: '',
            left: {
              tag: "D'",
            },
            right: {
              tag: '',
              left: {
                tag: '',
                left: {
                  tag: '',
                  left: {
                    tag: '',
                    left: {
                      tag: '',
                      left: {
                        tag: 'x',
                      },
                      right: {
                        tag: '',
                        left: {
                          tag: '',
                          left: {
                            tag: 'y2',
                          },
                          right: {
                            tag: "z'",
                          },
                        },
                        right: {
                          tag: 'z',
                        },
                      },
                    },
                    right: {
                      tag: "Lw'",
                    },
                  },
                  right: {
                    tag: 'M',
                  },
                },
                right: {
                  tag: 'F2',
                },
              },
              right: {
                tag: '',
                left: {
                  tag: '',
                  left: {
                    tag: '',
                    left: {
                      tag: '',
                      left: {
                        tag: 'B',
                      },
                      right: {
                        tag: "B2'",
                      },
                    },
                    right: {
                      tag: 'B2',
                    },
                  },
                  right: {
                    tag: '',
                    left: {
                      tag: '',
                      left: {
                        tag: '',
                        left: {
                          tag: 'L2',
                        },
                        right: {
                          tag: "L2'",
                        },
                      },
                      right: {
                        tag: '',
                        left: {
                          tag: "x'",
                        },
                        right: {
                          tag: 'y',
                        },
                      },
                    },
                    right: {
                      tag: "M'",
                    },
                  },
                },
                right: {
                  tag: '',
                  left: {
                    tag: '',
                    left: {
                      tag: '',
                      left: {
                        tag: "B'",
                      },
                      right: {
                        tag: 'Lw',
                      },
                    },
                    right: {
                      tag: '',
                      left: {
                        tag: '',
                        left: {
                          tag: '',
                          left: {
                            tag: 'z2',
                          },
                          right: {
                            tag: '',

                            right: {
                              tag: 'Bw',
                            },
                          },
                        },
                        right: {
                          tag: '',
                          left: {
                            tag: '',
                            left: {
                              tag: "Bw'",
                            },
                            right: {
                              tag: 'Bw2',
                            },
                          },
                          right: {
                            tag: '',
                            left: {
                              tag: 'D2',
                            },
                            right: {
                              tag: "Dw'",
                            },
                          },
                        },
                      },
                      right: {
                        tag: '',
                        left: {
                          tag: '',
                          left: {
                            tag: 'Dw',
                          },
                          right: {
                            tag: '',
                            left: {
                              tag: 'Dw2',
                            },
                            right: {
                              tag: 'E',
                            },
                          },
                        },
                        right: {
                          tag: '',
                          left: {
                            tag: '',
                            left: {
                              tag: "E'",
                            },
                            right: {
                              tag: 'E2',
                            },
                          },
                          right: {
                            tag: '',
                            left: {
                              tag: 'Fw2',
                            },
                            right: {
                              tag: 'Lw2',
                            },
                          },
                        },
                      },
                    },
                  },
                  right: {
                    tag: '',
                    left: {
                      tag: '',
                      left: {
                        tag: 'Fw',
                      },
                      right: {
                        tag: "Fw'",
                      },
                    },
                    right: {
                      tag: '',
                      left: {
                        tag: '',
                        left: {
                          tag: '',
                          left: {
                            tag: '',
                            left: {
                              tag: 'M2',
                            },
                            right: {
                              tag: 'S2',
                            },
                          },
                          right: {
                            tag: 'Rw2',
                          },
                        },
                        right: {
                          tag: '',
                          left: {
                            tag: 'S',
                          },
                          right: {
                            tag: "S'",
                          },
                        },
                      },
                      right: {
                        tag: '',
                        left: {
                          tag: '',
                          left: {
                            tag: 'Uw',
                          },
                          right: {
                            tag: "Uw'",
                          },
                        },
                        right: {
                          tag: '',
                          left: {
                            tag: '',
                            left: {
                              tag: 'Uw2',
                            },
                            right: {
                              tag: 'x2',
                            },
                          },
                          right: {
                            tag: "y'",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          right: {
            tag: "R2'",
          },
        },
        right: {
          tag: '',
          left: {
            tag: '',
            left: {
              tag: "L'",
            },
            right: {
              tag: 'L',
            },
          },
          right: {
            tag: '',
            left: {
              tag: '',
              left: {
                tag: 'R2',
              },
              right: {
                tag: 'U2',
              },
            },
            right: {
              tag: 'F',
            },
          },
        },
      },
    },
  },
};

/**
 *
 * @param compressedMoves Move sequence compressed by the Huffman tree in backend's Rust source
 * @returns Decompressed, human-legible move sequence
 */
export function decompress(compressedMoves?: Buffer) {
  if (!compressedMoves) return '';

  let node: Node | undefined = TREE;
  let out = '';

  // Read bit by bit
  for (let byte of compressedMoves) {
    for (let i = 0; i < 8; i++) {
      const bit = byte & 0b10000000;
      byte <<= 1;

      // 0 = left, 1 = right
      node = bit ? node?.right : node?.left;

      if (!node) {
        // Sequence lead us to nowhere.
        // Either it finished, or it was malformed (silent err)
        return out.trim();
      }

      if (node.tag !== '') {
        // We hit a leaf. Append to "out" and start from root again
        out += `${node.tag} `;
        node = TREE;
      }
    }
  }

  return out.trim();
}
