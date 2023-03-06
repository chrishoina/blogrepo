# Custom ORDS Module in an Oracle Autonomous Database 

import requests
import time
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import BackendApplicationClient

# Importing the base URI from this python file.
from testurls import test3_url

# A separate python file I created and later import here. It contains my credentials, so as not to show them in this script here. 
from oauthcreds import token_url, client_id, client_secret

# Including this to show the elapsed time. Used for comparing to other variations (e.g. using ORDS as an alternative method).
start = time.time()

token_url = token_url
client_id = client_id
client_secret = client_secret
 
client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)

token = oauth.fetch_token(token_url, client_id=client_id, client_secret=client_secret)

bearer_token = token['access_token']


# Location can be anything from the table. Now, only the single variable needs to be passed. Business logic has been abstracted somewhat; as it now resides within
# ORDS. This could make your application more portable (to other languages and frameworks, since there are fewer idiosyncracies and dependencies)

location = "ZAF"
# print(location)
# In Database Actions, we:
#   1. Create an API Module
#   2. Then create a Resource Template
#   3. Finally, a GET Resource Handler that consists of the code from test1.py:

#           select * from BUSCONFIND where location= :id
#               order by value ASC

url = (test3_url + location)
print(url)

responsefromadb = requests.get(url, headers={'Authorization': 'Bearer ' + bearer_token})
print(responsefromadb.json())

# print(responsefromadbcontent())

end = time.time()
print(end - start)
