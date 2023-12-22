import os

PATH_OUT = "C:\\Users\\Wellington\\Documents\\TCC\\TCCAPP\\src\\utils\\poses.js"
PREFIXO = "../../assets/poses/"

path_root = os.path.dirname(__file__)

if os.path.isfile(PATH_OUT):
    os.remove(PATH_OUT)

# export const Poses = {
    
# }
content = "\n// Gerado Automaticamente\n"
content += "\nconst Poses = {\n"

for dirname, drs, filenames in os.walk(os.path.join(path_root, "poses")):
    if not filenames:
        continue

    content += f"\t{os.path.basename(dirname)}: [\n"

    for filename in filenames:
        if not '.png' in filename and not '.jpg' in filename:
            continue

        filepath = PREFIXO + f"{os.path.basename(dirname)}/{filename}"

        content += f'\t\trequire("{filepath}"),\n'

    content += "\t],\n"

content += "}\n\nexport default Poses;"

with open(PATH_OUT, "w") as f:
    f.write(content)