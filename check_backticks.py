with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check lines around the modal template
for i in range(2833, 2912):
    line = lines[i]
    # Show backtick characters specifically
    has_backtick = '`' in line
    has_template = '${' in line
    print(f"Line {i+1}: backtick={has_backtick}, template={has_template}, content={repr(line[:100])}")
