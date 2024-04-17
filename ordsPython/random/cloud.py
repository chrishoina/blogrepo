import requests
import json
import webbrowser

url = 'https://objectstorage.us-phoenix-1.oraclecloud.com/n/dwcsprod/b/moviestream_data_load_workshop_20210709/o/'

r = requests.get(url)

data = r.json()
# print(data)

newlist = []
for name in data['objects']:
    newlist.append((name['name']))

# print(newlist)

length = len(newlist)
# print(length)

newurl = []

for i in range(length):
    newurl = url + newlist[i]
    webbrowser.open(newurl, new=0, autoraise=True)
    print(newurl)

