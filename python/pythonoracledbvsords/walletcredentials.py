# REMOVE ALL the brackets [] as you enter in your own information. 
# The username for the user accessing the database. In this case, I created a separate "devuser". Just make sure, whatever it is, you use it for all three
# tests (otherwise it could become an issue when you get to the OAuth2.0 client steps in "test3.py" 
# uname = "[user name]"
uname = "devuser"

# pwd = "[the password for the above user]"
pwd = ""

# Review my "test1.py" file to see how I have this set-up. I have installed the "Path Intellisense" VS Code extension for simplifying entering path and file
# names. So if it looks weird, that is why. 
# cdir = "[directory (aka folder) where this stuff lives]"

cdir = "./config_dir/"

# This is the "Wallet Location"; I went ahead and included my wallet in the configuration directory as well.
# wloc = "[directory (aka folder) where this stuff lives]"

wltloc = "./config_dir/"

# The Wallet password. When you are in the OCI cloud console (as the admin!), you'll download your wallet. We ask you to include a wallet password for
# security purposes. I just used "password1234" since this all for testing purposes. But keep this in mind for real-world usage...don't use
# "password1234" you knucklehead. 
# wpwd = "[Your wallet password]"

wltpwd = ""

# DSN stands for dataservice name. These can all be found in your tnsnames.ora file. You'll see three options: "[Your DB name]_high", "[Your DB name]_low",
# '[Your DB name]_medium"

# dsn = "[Service name]"

dsn = ""