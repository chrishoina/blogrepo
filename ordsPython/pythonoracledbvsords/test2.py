# Auto-REST enabled with ORDS; in an Oracle Autonomous Database with query parameters
import requests
import pprint

# Importing the base URI from this python file.
from testurls import test2_url

# An unprotected endpoint that has been "switched on" with the ORDS Auto-REST enable feature. Query parameters can be added/passed to the Base URI for GET-ing more discrete information.
url = (test2_url + '?q={"location":"ZAF","value":{"$gt":100},"$orderby":{"value":"asc"}}}')

# For prototyping an application, in its earlier stages, this could really work. On your front end, you expect the user to make certain selections, and you'll still pass those as parameters. 
# But here, you do this as a query string. In later stages, you may want to streamline your application code by placing all this into a PL/SQL or SQL statement. Thereby separating application
# logic and business logic. You'll see that in the test3.py file. 
# This works, but you can see how it gets verbose, quick. Its a great jumping-off point.

responsefromadb = requests.get(url)
print(responsefromadb.text)
print(responsefromadb.status_code)
pprint.pprint(responsefromadb.json())
