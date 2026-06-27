with open('index.html', 'rb') as f:
    data = f.read()

idx = data.find(b'mapInstance = null')
print('Bytes before mapInstance:')
print(repr(data[idx-20:idx+30]))
