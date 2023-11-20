#Connecting to an Oracle Autonomous Database using the Python-OracleDB driver.

import oracledb

# A separate python file I created and later import here. It contains my credentials, so as not to show them in this script here. 

from walletcredentials import uname, pwd, cdir, wltloc, wltpwd, dsn

# Requires a config directory with ewallet.pem and tnsnames.ora files.

with oracledb.connect(user=uname, password=pwd, dsn=dsn, config_dir=cdir, wallet_location=wltloc, wallet_password=wltpwd) as connection:
    with connection.cursor() as cursor:

# SQL statements should not contain a trailing semicolon (“;”) or forward slash (“/”).

        sql = """select * from BUSCONFIND where location='ZAF'
        order by value ASC """
        for r in cursor.execute(sql):
            print(r)