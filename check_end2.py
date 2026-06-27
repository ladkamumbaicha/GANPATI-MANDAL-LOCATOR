with open('index.html', 'rb') as f:
    data = f.read()

# Find modalBody.innerHTML section
idx = data.find(b'modalBody.innerHTML')
print('modalBody.innerHTML section:')
print(repr(data[idx:idx+2000]))
