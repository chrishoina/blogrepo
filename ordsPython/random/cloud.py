import requests 

url = 'https://objectstorage.us-phoenix-1.oraclecloud.com/n/dwcsprod/b/moviestream_data_load_workshop_20210709/o'

r = requests.get(url)

print(r)