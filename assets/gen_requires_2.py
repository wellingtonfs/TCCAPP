import os, re

PATH_OUT = "C:\\Users\\Wellington\\Documents\\TCC\\TCCAPP\\src\\utils\\poses.js"
PREFIXO = "../../assets/poses/"

path_root = os.path.dirname(__file__)

if os.path.isfile(PATH_OUT):
    os.remove(PATH_OUT)

# export const Poses = {
    
# }
content = "\n// Gerado Automaticamente\n"
content += "\nconst Poses = {\n"

for palavra in os.listdir(os.path.join(path_root, "poses")):

    path_palavra = os.path.join(path_root, "poses", palavra)

    if not os.path.isdir(os.path.join(path_palavra, "1")):
        continue

    content += f"\t{palavra}: [\n"

    for pose_folder in sorted(os.listdir(path_palavra), key=lambda x: int(x)):

        path_pose_folder = os.path.join(path_palavra, pose_folder)

        content += f"\t\t[\n"

        for pose in sorted(os.listdir(path_pose_folder), key = lambda x: int(x.split('.')[0])):

            filepath = PREFIXO + f"{palavra}/{pose_folder}/{pose}"

            content += f'\t\t\trequire("{filepath}"),\n'

        content += "\t\t],\n"

    content += "\t],\n"

content += "}\n\nexport default Poses;"

with open(PATH_OUT, "w", encoding="utf-8") as f:
    f.write(content)