# This program generates Rust code for a Huffman tree with the proper specification
# and also a match block to map move to compressed sequence

data = [
    ["00", 'R'],
    ["01", "R'"],
    ["100", "U'"],
    ["1010000", "Rw'"],
    ["1010001", 'Rw'],
    ["101001", 'D'],
    ["10101", "F'"],
    ["1011", "U2'"],
    ["110", 'U'],
    ["111000", "D'"],
    ["11100100000", 'x'],
    ["1110010000100", 'y2'],
    ["1110010000101", "z'"],
    ["111001000011", 'z'],
    ["1110010001", "Lw'"],
    ["111001001", 'M'],
    ["11100101", 'F2'],
    ["11100110000", 'B'],
    ["11100110001", "B2'"],
    ["1110011001", 'B2'],
    ["111001101000", 'L2'],
    ["111001101001", "L2'"],
    ["111001101010", "x'"],
    ["111001101011", 'y'],
    ["1110011011", "M'"],
    ["11100111000", "B'"],
    ["11100111001", 'Lw'],
    ["1110011101000", 'z2'],
    ["11100111010011", 'Bw'],
    ["11100111010100", "Bw'"],
    ["11100111010101", 'Bw2'],
    ["11100111010110", 'D2'],
    ["11100111010111", "Dw'"],
    ["1110011101100", 'Dw'],
    ["11100111011010", 'Dw2'],
    ["11100111011011", 'E'],
    ["11100111011100", "E'"],
    ["11100111011101", 'E2'],
    ["11100111011110", 'Fw2'],
    ["11100111011111", 'Lw2'],
    ["11100111100", 'Fw'],
    ["11100111101", "Fw'"],
    ["11100111110000", 'M2'],
    ["11100111110001", 'S2'],
    ["1110011111001", 'Rw2'],
    ["1110011111010", 'S'],
    ["1110011111011", "S'"],
    ["1110011111100", 'Uw'],
    ["1110011111101", "Uw'"],
    ["11100111111100", 'Uw2'],
    ["11100111111101", 'x2'],
    ["1110011111111", "y'"],
    ["11101", "R2'"],
    ["111100", "L'"],
    ["111101", 'L'],
    ["1111100", 'R2'],
    ["1111101", 'U2'],
    ["111111", 'F'],
]

indices = ["R","R'","L","L'","U","U'","B","B'","D","D'","F","F'","M","M'","E","E'","S","S'"]

definitions = {
    "R": "R",
    "L": "L",
    "D": "D",
    "U": "U",
    "F": "F",
    "B": "B",

    "R'": "R'",
    "L'": "L'",
    "D'": "D'",
    "U'": "U'",
    "F'": "F'",
    "B'": "B'",

    "R2": "R R",
    "L2": "L L",
    "D2": "D D",
    "U2": "U U",
    "F2": "F F",
    "B2": "B B",

    "R2'": "R' R'",
    "L2'": "L' L'",
    "U2'": "U' U'",
    "B2'": "B' B'",

    ###

    "Rw": "R M'",
    "Lw": "L M",
    "Dw": "D E",
    "Uw": "U E'",
    "Fw": "F S",
    "Bw": "B S'",

    "Rw'": "R' M",
    "Lw'": "L' M'",
    "Dw'": "D' E'",
    "Uw'": "U' E",
    "Fw'": "F' S'",
    "Bw'": "B' S",

    "Rw2": "R R M M",
    "Lw2": "L L M M",
    "Dw2": "D D E E",
    "Uw2": "U U E E",
    "Fw2": "F F S S",
    "Bw2": "B B S S",

    "M": "M",
    "E": "E",
    "S": "S",
    "M'": "M'",
    "E'": "E'",
    "S'": "S'",
    "M2": "M M",
    "E2": "E E",
    "S2": "S S",

    "x": "R L' M'",
    "y": "U D' E'",
    "z": "F B' S",
    "x'": "R' L M",
    "y'": "U' D E",
    "z'": "F' B S'",
    "x2": "R R L L M M",
    "y2": "U U D D E E",
    "z2": "F F B B S S",
}

class Node:
    def __init__(self, tag):
        self.left = None
        self.right = None
        self.tag = tag
    
    def debug(self):
        left = "None" if self.left is None else f"Some(&{self.left.debug()})"
        right = "None" if self.right is None else f"Some(&{self.right.debug()})"

        return f"""
Node {{
    indices: {[] if self.tag=="node" else [indices.index(x) for x in definitions[self.tag].split()]},
    left: {left},
    right: {right},
}}
        """

    def insert(self, path, tag):
        if path == "":
            self.tag = tag
        else:
            if path[0]=='0':
                if self.left is None:
                    self.left = Node('node')
                self.left.insert(path[1:], tag)
            else:
                if self.right is None:
                    self.right = Node('node')
                self.right.insert(path[1:], tag)

tree = Node('node')

for r in data:
    tree.insert(*r)

print(tree.debug())

print('\n'.join([x[0] for x in sorted([(f""""{x[1]}" => (0b{x[0]}, {len(x[0])}),""",len(x[0])) for x in data], key=lambda x: x[1])]))
