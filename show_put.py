lines = open('server.js', 'r', encoding='utf-8').read().split('\n')
for i, line in enumerate(lines):
    if 'if (quote !== undefined) m.quote = quote;' in line:
        for j in range(i-2, i+5):
            if 0 <= j < len(lines):
                print(f"Line {j+1}: {repr(lines[j])}")
        print("===")
    if 'quote: quote || \'\'' in line and i > 300:
        for j in range(i-2, i+5):
            if 0 <= j < len(lines):
                print(f"Line {j+1}: {repr(lines[j])}")
        print("===")
