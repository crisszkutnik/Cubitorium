from pprint import pprint
import subprocess

def remove_y(str):
    return str.replace("y'","").replace("y2","").replace("y","")

def read_solutions_from_csv(path):
    lines = ""
    with open(path, "r") as f:
        lines = f.readlines()
    
    return [[s[0].strip(), remove_y(s[2].strip())] for s in [x.split(",") for x in lines[1:]]]

def add_setup(entry):
    cas, solution = entry
    setup = subprocess.getoutput(f"""nissy solve light "{solution.replace("2'","2")}" """)
    print(setup)
    trimFrom = setup.index("(")

    return [cas, setup[:trimFrom-1], solution]

def fix_file(file):
    rows = read_solutions_from_csv(file)
    nashe_rows = [', '.join(add_setup(x)) for x in rows]

    nashe_content = "case_id, setup, solution\n"
    nashe_content += '\n'.join(nashe_rows)

    with open(file, "w") as f:
        f.write(nashe_content+"\n")

paths = [
    # "algs/2x2/cll.csv",
    # "algs/2x2/eg1.csv",
    # "algs/2x2/eg2.csv",
    # "algs/3x3_cfop/f2l.csv",
    "algs/3x3_cfop/oll.csv",
    "algs/3x3_cfop/pll.csv",
    "algs/3x3_roux/cmll.csv",
    "algs/3x3_zbll/zbll_a.csv",
    "algs/3x3_zbll/zbll_h.csv",
    "algs/3x3_zbll/zbll_l.csv",
    "algs/3x3_zbll/zbll_pi.csv",
    "algs/3x3_zbll/zbll_s.csv",
    "algs/3x3_zbll/zbll_t.csv",
    "algs/3x3_zbll/zbll_u.csv",
]

for path in paths:
    fix_file(path)
