# Custom ORDS Module in an Oracle Autonomous Database 
import requests
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import BackendApplicationClient
import pprint

# Importing the base URI from this python file.
from testurls import test3_url

# A separate python file I created and later import here. It contains my credentials, so as not to show them in this script here. 

from oauth2creds import token_url, client_id, client_secret

token_url = token_url
client_id = client_id
client_secret = client_secret

# Backend Application Client is the OAuth grant type. There are four all can be found here: https://www.rfc-editor.org/rfc/rfc6749#section-4
# More appropriately, we use the "Client Credentials Grant" type. 

client = BackendApplicationClient(client_id=client_id)

# Based on requests.session which is actually based on urlib3's connection pooling, more here: https://urllib3.readthedocs.io/en/latest/reference/urllib3.connectionpool.html

oauth = OAuth2Session(client=client)

# Here we do an initial GET to the Authorization Server (the thing that gives us the Bearer Token for the later GET request to the BUSCONFIND Table / REST API).

token = oauth.fetch_token(token_url, client_id=client_id, client_secret=client_secret)

# If you were to print out token, you can do it like this: 
print(token) 

# Then you would see an object with items. Here we are saying that we want the value of the 'access_token' so we can pass that along in the subsequent GET request.

bearer_token = token['access_token']

# Location can be anything from the table. Now, only the single variable needs to be passed. 

location = "ZAF"
print(location)

# The business logic has been abstracted somewhat; as it now resides within ORDS. This could make your application more portable (to other languages and frameworks, since there are fewer idiosyncracies and dependencies):

# ------------------------------------------------------------------------------ # 
# In Database Actions, we:
#   1. Create an API Module
#   2. Then create a Resource Template
#   3. Finally, a GET Resource Handler that consists of the code from test1.py:

#           select * from BUSCONFIND where location= :id
#               order by value ASC
# ------------------------------------------------------------------------------ # 

url = (test3_url + location)
print(url)

# Notice the space between 'Bearer ' and the '+ bearer_token' This is intentional. It
# wasn't working for me otherwise.
responsefromadb = requests.get(url, headers={'Authorization': 'Bearer ' + bearer_token}).json()

# Recall, this is completely optional. You could print the response using the requests library. This is easyier to scan/read though. 
pprint.pprint(responsefromadb)