# This program generates the Huffman tree trained on every algorithm setup and solution in algs/
# Every move ending in 2' is ignored except R2' U2' L2' B2' since they are valid in Pyraminx

from collections import Counter
from dahuffman import HuffmanCodec

def read_files(basedir, names):
    contents = []

    for name in names:
        with open(basedir + name, "r") as f:
            f.readline()
            contents += f.readlines()

    return contents

def remove_trailing_rot(seq):
    split = seq.split()
    if ("x" in split[0] or "y" in split[0] or "z" in split[0]):
        split.pop(0)
    if ("x" in split[-1] or "y" in split[-1] or "z" in split[-1]):
        split.pop()

    return split

lines = read_files(\
    "algs/",\
    [f"3x3_cfop/{x}" for x in ["f2l.csv", "pll.csv", "oll.csv"]]+\
    [f"3x3_roux/{x}" for x in ["cmll.csv"]]+\
    [f"3x3_zbll/{x}" for x in [f"zbll_{y}.csv" for y in ["a","h","l","pi","s","t","u"]]]+\
    [f"2x2/{x}" for x in ["cll.csv","eg1.csv","eg2.csv"]]+\
    [f"pyra/{x}" for x in ["l4e.csv"]]\
)

raw_moves = [remove_trailing_rot(x.split(', ')[1]) for x in lines] + [[
    "R","L","D","U","F","B",
    "R'","L'","D'","U'","F'","B'",
    "R2","L2","D2","U2","F2","B2",
    "Rw","Lw","Dw","Uw","Fw","Bw",
    "Rw2","Lw2","Dw2","Uw2","Fw2","Bw2",
    "Rw'","Lw'","Dw'","Uw'","Fw'","Bw'",
    "M","E","S","M'","E'","S'","M2","E2","S2",
    "x","y","z","x'","y'","z'","x2","y2","z2"
]]
symbols = [y for y in [sym for elem in raw_moves for sym in elem] if not y in \
           ["D2'","F2'","Rw2'","Lw2'","Dw2'","Uw2'","Fw2'","Bw2'","M2'","E2'","S2'","x2'","y2'","z2'"]]
freqs = Counter(symbols)

codec = HuffmanCodec.from_frequencies(freqs)

table = sorted(codec.get_code_table().items(), key = lambda x: x[1][0])

print("Avg length: ", sum([freqs[k]*len(bin(v[1])[2:]) + (1 if v[1] in ["0","1"] else 0) for (k,v) in table])/len(symbols))

codec.print_code_table()

# Bits Code           Value Symbol
#    2 00                 0 'R'
#    2 01                 1 "R'"
#    3 100                4 "U'"
#    7 1010000           80 "Rw'"
#    7 1010001           81 'Rw'
#    6 101001            41 'D'
#    5 10101             21 "F'"
#    4 1011              11 "U2'"
#    3 110                6 'U'
#    6 111000            56 "D'"
#   11 11100100000     1824 'x'
#   13 1110010000100   7300 'y2'
#   13 1110010000101   7301 "z'"
#   12 111001000011    3651 'z'
#   10 1110010001       913 "Lw'"
#    9 111001001        457 'M'
#    8 11100101         229 'F2'
#   11 11100110000     1840 'B'
#   11 11100110001     1841 "B2'"
#   10 1110011001       921 'B2'
#   12 111001101000    3688 'L2'
#   12 111001101001    3689 "L2'"
#   12 111001101010    3690 "x'"
#   12 111001101011    3691 'y'
#   10 1110011011       923 "M'"
#   11 11100111000     1848 "B'"
#   11 11100111001     1849 'Lw'
#   13 1110011101000   7400 'z2'
#   14 11100111010010 14802 _EOF
#   14 11100111010011 14803 'Bw'
#   14 11100111010100 14804 "Bw'"
#   14 11100111010101 14805 'Bw2'
#   14 11100111010110 14806 'D2'
#   14 11100111010111 14807 "Dw'"
#   13 1110011101100   7404 'Dw'
#   14 11100111011010 14810 'Dw2'
#   14 11100111011011 14811 'E'
#   14 11100111011100 14812 "E'"
#   14 11100111011101 14813 'E2'
#   14 11100111011110 14814 'Fw2'
#   14 11100111011111 14815 'Lw2'
#   11 11100111100     1852 'Fw'
#   11 11100111101     1853 "Fw'"
#   14 11100111110000 14832 'M2'
#   14 11100111110001 14833 'S2'
#   13 1110011111001   7417 'Rw2'
#   13 1110011111010   7418 'S'
#   13 1110011111011   7419 "S'"
#   13 1110011111100   7420 'Uw'
#   13 1110011111101   7421 "Uw'"
#   14 11100111111100 14844 'Uw2'
#   14 11100111111101 14845 'x2'
#   13 1110011111111   7423 "y'"
#    5 11101             29 "R2'"
#    6 111100            60 "L'"
#    6 111101            61 'L'
#    7 1111100          124 'R2'
#    7 1111101          125 'U2'
#    6 111111            63 'F'
