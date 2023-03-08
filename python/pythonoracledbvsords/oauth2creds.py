# When you create your OAuth 2.0 client, you'll be provided both a client ID and a client Secret. You'll need these to authenticate, when running "test3.py"
# Same as before, remove the brackets (the [] in the examples below) when you enter in all your information. You just need to keep the quotes. 

# Also, and I'm not sure why yet, you need to keep the two dots at the end of your ID and Secret. This won't make sense now, but you'll see.
client_id = '[your Cient ID]'
client_secret = '[your Client Secret]'

# These will be your Base Path addresses followed by the user that you are setting this OAuth client under, followed by "oath/auth", and "oauth/token", respectively.
# They'll look something like this: 

# For the authorization
authorization_url = 'https://[an alpha-numeric string]-[your database name].adb.[your region].oraclecloudapps.com/ords/[the user that set up the OAuth 2.0 client]/oath/auth' 

# To retrive a token:
token_url = 'https://[an alpha-numeric string]-[your database name].adb.[your region].oraclecloudapps.com/ords/[the user that set up the OAuth 2.0 client]/oath/token'

 
