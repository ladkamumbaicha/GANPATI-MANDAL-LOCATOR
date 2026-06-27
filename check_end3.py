with open('index.html', 'rb') as f:
    data = f.read()

# Find modalBody.innerHTML section - get more content
idx = data.find(b'modalBody.innerHTML')
chunk = data[idx:idx+5000]
# Find the closing backtick and semicolon
end_idx = chunk.find(b'`;')
print('Found `; at offset:', end_idx)
print('Context around end:')
print(repr(chunk[end_idx-100:end_idx+50]))
