import glob

for f in glob.glob('*.html'):
    with open(f, encoding='utf-8') as file:
        content = file.read()
    
    # Replace the exact space-padded separators
    content = content.replace(' — ', ' | ').replace(' - ', ' | ')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
