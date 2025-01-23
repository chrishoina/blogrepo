INPUT
PROMPT Choose a new database username:
ACCEPT NEWUSER CHAR PROMPT 'Enter new user name here:'
PROMPT Choose a temporary password for &&NEWUSER: 
ACCEPT NEWPASS CHAR PROMPT 'Select a password that conforms to ORDS security guidelines:'

/*
I wish I could figure out a way to ONLY ask for username > check that against existing database users > AND THEN allow a user to continue with the 'choose password' step. I was only able to figure out how to ask for the username and password AND THEN checks against the database. I stole the code from this thread: https://stackoverflow.com/questions/30710990/creating-an-oracle-user-if-it-doesnt-already-exist 

Currently, its just extra steps for the user; kind of annoying. If you're reading this and can figure out a way to get this working, let me know! I'll make the change and attribute you in the comments :) 
*/

Set Verify On 

/*
You can refer to section 6.3.10.11 for more details on this SET VERIFY OFF command https://docs.oracle.com/en/database/oracle/oracle-database/23/sqpug/using-substitution-variables-sqlplus.html#GUID-3ACD41F3-A5A2-48D5-8E81-C29F9C14C865
*/

/*
The difference between using single and double ampersands: https://docs.oracle.com/en/database/oracle/oracle-database/23/sqpug/using-substitution-variables-sqlplus.html#GUID-C6BE6E41-821F-413E-B4B1-56AAE4A46298
*/

Declare
check_if_user_exists Integer;
plsql_block VARCHAR2(500);
NEWUSER VARCHAR2(20) := '&&NEWUSER';
Begin
  Select count(*) Into check_if_user_exists From dba_users Where username=NEWUSER;
  If (check_if_user_exists = 0) Then
  Execute Immediate 'Create User &&NEWUSER Identified By &&NEWPASS';
  Execute Immediate 'Grant Connect To &&NEWUSER';
  Execute Immediate 'Grant Resource To &&NEWUSER';
  Execute Immediate 'Grant Unlimited Tablespace To &&NEWUSER';
  plsql_block := 'Begin ORDS_ADMIN.ENABLE_SCHEMA(p_schema => :1); Commit; End;';
  Execute Immediate plsql_block using NEWUSER;
  End If;
End;
/

/*
The p_schema parameter is mandatory, that's why I'm including it. If you omit the other parameters, the procedure will use the default parameter values. 

Learn more about this procedure here: https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/23.2/orddg/oracle-rest-data-services-administration-pl-sql-package-reference.html#GUID-459B8B6F-16EC-4FEC-9969-E8231668AD85

I was able to get this entire thing to work through trial-and-error, while also using this for reference: https://docs.oracle.com/cd/B13789_01/appdev.101/b10807/13_elems017.htm
*/

PROMPT
PROMPT
PROMPT Congrats 🎉 the user: &&NEWUSER, with the password: &&NEWPASS is now a bona fide database user 🙌🏻! 
PROMPT Not only that, &&NEWUSER can log into Database Actions and REST-Enable their database objects too 😍!
PROMPT
PROMPT
PROMPT Click RETURN to return to the SQLcl prompt. And NEVER forget:
PAUSE "Unless you see any compilation errors, the user you've created can now access Database actions at host:port/ords. On ORDS Standalone this would look something like https://localhost:8443/ords http://localhost:8080/ords or  !"
