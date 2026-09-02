import glob

for f in glob.glob('*.html'):
    with open(f, encoding='utf-8') as file:
        content = file.read()
    
    # Specific sentence in index.html
    content = content.replace("<strong>Afolabi Joshua</strong>, known as Kingsley.", "<strong>Kingsley</strong>.")
    
    # Meta tags and other instances
    content = content.replace("Afolabi Joshua (Kingsley)", "Kingsley")
    content = content.replace("Kingsley (Afolabi Joshua)", "Kingsley")
    content = content.replace("Afolabi Joshua Kingsley", "Kingsley")
    content = content.replace("Afolabi Joshua, ", "")
    content = content.replace(", Afolabi Joshua", "")
    content = content.replace("Afolabi Joshua", "Kingsley")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
