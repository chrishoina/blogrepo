#Connecting to an Oracle Autonomous Database uing the OracleDB-Python 
import time 
import oracledb

# A separate python file I created and later import here. It contains my credentials, so as not to show them in this script here. 
from wltcreds import uname, pwd, cdir, wloc, wpwd, dsn 

# Including this to show the elapsed time. Used for comparing to other variations (e.g. using ORDS as an alternative method).
start = time.time()

# Requires a config directory with ewallet.pem and tnsnames.ora files

with oracledb.connect(user=uname, password=pwd, dsn=dsn, config_dir=cdir, wallet_location=wloc, wallet_password=wpwd) as connection:
    with connection.cursor() as cursor:

# SQL statements should not contain a trailing semicolon (“;”) or forward slash (“/”). This will fail:
        sql = """select * from BUSCONFIND where location='ZAF'
order by value ASC """
        for r in cursor.execute(sql):
            print(r)

end = time.time()
print(end - start)
