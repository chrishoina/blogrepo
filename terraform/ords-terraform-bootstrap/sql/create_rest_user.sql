-- Creates a REST-enabled schema in the current PDB.
--
-- Required SQLcl substitution variables (defined by the caller before @this-file):
--   target_user         - schema name, for example ORDSDEMO
--   target_password     - used only when the schema must be created
--   ORDS_AUTO_REST_AUTH - TRUE or FALSE
--
-- This file deliberately contains no ACCEPT commands. It is therefore safe for
-- a non-interactive wrapper, provided the three variables have been defined.

SET ECHO OFF
SET VERIFY OFF
SET SERVEROUTPUT ON
WHENEVER OSERROR EXIT FAILURE
WHENEVER SQLERROR EXIT SQL.SQLCODE

VARIABLE summary_user_action VARCHAR2(4000)
VARIABLE summary_password_action VARCHAR2(4000)
VARIABLE summary_ords_action VARCHAR2(4000)

declare
   v_user           varchar2(128) := dbms_assert.simple_sql_name(upper('&&target_user'));
   v_password       varchar2(512) := '&&target_password';
   v_user_exists    number;
   v_auto_rest_auth varchar2(5) :=
      case
         when upper(trim('&&ORDS_AUTO_REST_AUTH')) in ( 'TRUE',
                                                        'Y',
                                                        'YES',
                                                        '1' ) then
            'TRUE'
         else
            'FALSE'
      end;
   v_ords_available number;
   v_roles          sys.odcivarchar2list := sys.odcivarchar2list(
      'CONNECT',
      'RESOURCE',
      'DB_DEVELOPER_ROLE', -- The Autonomous AI Database comes with the pre-defined DWROLE; which shares many of the same privileges. Consider using DWROLE for ADB-S.
      'GRAPH_DEVELOPER',
      'SODA_APP'
   );
   v_privileges     sys.odcivarchar2list := sys.odcivarchar2list(
      'CREATE ANALYTIC VIEW',
      'CREATE ATTRIBUTE DIMENSION',
      'ALTER SESSION',
      'CREATE HIERARCHY',
      'CREATE JOB',
      'CREATE MATERIALIZED VIEW',
      'CREATE MINING MODEL',
      'CREATE PROCEDURE',
      'CREATE SEQUENCE',
      'CREATE SESSION',
      'CREATE SYNONYM',
      'CREATE TABLE',
      'CREATE TRIGGER',
      'CREATE TYPE',
      'CREATE VIEW',
      'CREATE ANY DIRECTORY',
      'UNLIMITED TABLESPACE'
   );
begin
   if v_password is null then
      raise_application_error(
         -20001,
         'target_password must be supplied by the caller.'
      );
   end if;
   select count(*)
     into v_user_exists
     from dba_users
    where username = v_user;
   if v_user_exists = 0 then
      execute immediate 'CREATE USER '
                        || v_user
                        || ' IDENTIFIED BY "'
                        || replace(
         v_password,
         '"',
         '""'
      )
                        || '"';
      :summary_user_action := 'Created user '
                              || v_user
                              || '.';
      :summary_password_action := 'Set password during user creation.';
   else
      :summary_user_action := 'Reused existing user '
                              || v_user
                              || '.';
      :summary_password_action := 'Left the existing password unchanged.';
   end if;

   for i in 1..v_privileges.count loop
      execute immediate 'GRANT '
                        || v_privileges(i)
                        || ' TO '
                        || v_user;
   end loop;

   for i in 1..v_roles.count loop
      begin
         execute immediate 'GRANT '
                           || v_roles(i)
                           || ' TO '
                           || v_user;
      exception
         when others then
            dbms_output.put_line('Skipped role '
                                 || v_roles(i)
                                 || ': ' || sqlerrm);
      end;
   end loop;

   begin
      execute immediate 'GRANT READ, WRITE ON DIRECTORY DATA_PUMP_DIR TO ' || v_user;
   exception
      when others then
         dbms_output.put_line('Skipped DATA_PUMP_DIR grant: ' || sqlerrm);
   end;
   execute immediate 'ALTER USER '
                     || v_user
                     || ' DEFAULT ROLE ALL';
   for package_name in (
      select owner,
             object_name
        from dba_objects
       where object_type = 'PACKAGE'
         and object_name in ( 'DBMS_CLOUD',
                              'DBMS_VECTOR',
                              'DBMS_DATA_MINING',
                              'DBMS_VECTOR_DATABASE' )
   ) loop
      begin
         execute immediate 'GRANT EXECUTE ON '
                           || package_name.owner
                           || '.'
                           || package_name.object_name
                           || ' TO '
                           || v_user;
      exception
         when others then
            dbms_output.put_line('Skipped '
                                 || package_name.object_name
                                 || ': ' || sqlerrm);
      end;
   end loop;

   select count(*)
     into v_ords_available
     from dba_objects
    where object_name = 'ORDS_ADMIN'
      and object_type in ( 'PACKAGE',
                           'SYNONYM',
                           'PUBLIC SYNONYM' );

   if v_ords_available > 0 then
      execute immediate 'BEGIN ords_admin.enable_schema('
                        || 'p_enabled => TRUE, '
                        || 'p_schema => '
                        || dbms_assert.enquote_literal(v_user)
                        || ', '
                        || q'[p_url_mapping_type => 'BASE_PATH', ]'
                        || 'p_url_mapping_pattern => '
                        || dbms_assert.enquote_literal(lower(v_user))
                        || ', '
                        || 'p_auto_rest_auth => '
                        || v_auto_rest_auth
                        || '); END;';
      :summary_ords_action := 'Enabled ORDS with ORDS_ADMIN.ENABLE_SCHEMA.';
   else
      :summary_ords_action := 'Skipped ORDS enablement because ORDS_ADMIN was not found.';
   end if;

   dbms_output.put_line('Summary for ' || v_user);
   dbms_output.put_line(:summary_user_action);
   dbms_output.put_line(:summary_password_action);
   dbms_output.put_line(:summary_ords_action);
end;
/

EXIT SUCCESS