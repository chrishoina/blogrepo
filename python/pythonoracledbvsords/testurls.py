# FYI "test1.py" doesn't use a URI like this. You'll need the wallet information from your database, plus the user information for accesing the database. 
# You could use the admin credentials, but to simulate an actual user, I created a "devuser" user.

# Since you will have Auto-REST enabled a table for "test2", the entire URI will need to be added inside the quotes: 
# FYI: Remove the brackets when you add in your URI. You just need open quotation mark (' or "), the URI (https://.....), followed by close quotation mark (' or ")
# test2_url ='[URI for your auto-REST enabled table goes here]'
test2_url = '[ORDS goes here]'

# If you want to try out "test3", you'll need to create a fully custom Resource Module + Resource Template + Resource Handler (and code therein). I set up 
# an OAuth2.0 client as well. So if you want to test out this URI with the added level of security, you'll need to enable that too (see the test3.py file
# with all the requests_oauthlib and oauthlib.oauth2 library goodies. 
test3_url = ''
