SET SERVEROUTPUT ON;
Begin
   Execute Immediate 'Grant CONNECT to PDBADMIN';
   Execute Immediate 'Grant RESOURCE to PDBADMIN';
   Execute Immediate 'Grant PDB_DBA to PDBADMIN';
   Execute Immediate 'Grant AUDIT_ADMIN to PDBADMIN';
   Execute Immediate 'Grant AUDIT_VIEWER to PDBADMIN';
   Execute Immediate 'Grant SELECT_CATALOG_ROLE to PDBADMIN';
   Execute Immediate 'Grant CAPTURE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant AQ_ADMINISTRATOR_ROLE to PDBADMIN';
   Execute Immediate 'Grant AQ_USER_ROLE to PDBADMIN';
   Execute Immediate 'Grant ADM_PARALLEL_EXECUTE_TASK to PDBADMIN';
   Execute Immediate 'Grant PROVISIONER to PDBADMIN';
   Execute Immediate 'Grant XS_SESSION_ADMIN to PDBADMIN';
   Execute Immediate 'Grant XS_NAMESPACE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant XS_CACHE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant XS_CONNECT to PDBADMIN';
   Execute Immediate 'Grant GATHER_SYSTEM_STATISTICS to PDBADMIN';
   Execute Immediate 'Grant OPTIMIZER_PROCESSING_RATE to PDBADMIN';
   Execute Immediate 'Grant HS_ADMIN_SELECT_ROLE to PDBADMIN';
   Execute Immediate 'Grant OEM_ADVISOR to PDBADMIN';
   Execute Immediate 'Grant DV_OWNER to PDBADMIN';
   Execute Immediate 'Grant SODA_APP to PDBADMIN';
   Execute Immediate 'Grant DV_ACCTMGR to PDBADMIN';
   Execute Immediate 'Grant LBAC_DBA to PDBADMIN';
   Execute Immediate 'Grant DV_SECANALYST to PDBADMIN';
   Execute Immediate 'Grant DWROLE to PDBADMIN';
   Execute Immediate 'Grant CONSOLE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant CONSOLE_OPERATOR to PDBADMIN';
   Execute Immediate 'Grant CONSOLE_MONITOR to PDBADMIN';
   Execute Immediate 'Grant CONSOLE_DEVELOPER to PDBADMIN';
   Execute Immediate 'Grant DATAPUMP_CLOUD_EXP to PDBADMIN';
   Execute Immediate 'Grant DATAPUMP_CLOUD_IMP to PDBADMIN';
   Execute Immediate 'Grant CTXAPP to PDBADMIN';
   Execute Immediate 'Grant DV_MONITOR to PDBADMIN';
   Execute Immediate 'Grant DV_ADMIN to PDBADMIN';
   Execute Immediate 'Grant DV_PUBLIC to PDBADMIN';
   Execute Immediate 'Grant DV_PATCH_ADMIN to PDBADMIN';
   Execute Immediate 'Grant DV_STREAMS_ADMIN to PDBADMIN';
   Execute Immediate 'Grant DV_GOLDENGATE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant DV_XSTREAM_ADMIN to PDBADMIN';
   Execute Immediate 'Grant DV_GOLDENGATE_REDO_ACCESS to PDBADMIN';
   Execute Immediate 'Grant DV_AUDIT_CLEANUP to PDBADMIN';
   Execute Immediate 'Grant DV_DATAPUMP_NETWORK_LINK to PDBADMIN';
   Execute Immediate 'Grant DV_POLICY_OWNER to PDBADMIN';
   Execute Immediate 'Grant OML_DEVELOPER to PDBADMIN';
   Execute Immediate 'Grant APEX_ADMINISTRATOR_READ_ROLE to PDBADMIN';
   Execute Immediate 'Grant APEX_ADMINISTRATOR_ROLE to PDBADMIN';
   Execute Immediate 'Grant ORDS_ADMINISTRATOR_ROLE to PDBADMIN';
   Execute Immediate 'Grant OML_SYS_ADMIN to PDBADMIN';
   Execute Immediate 'Grant ADB_MONITOR to PDBADMIN';
   Execute Immediate 'Grant ADP_SERVICE$IMPL to PDBADMIN';
   Execute Immediate 'Grant LINEAGE_AUTHOR to PDBADMIN';
   Execute Immediate 'Grant LINEAGE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant CLOUD_INGEST$IMPL to PDBADMIN';
   Execute Immediate 'Grant CLOUD_INGEST_USER to PDBADMIN';
   Execute Immediate 'Grant CLOUD_INGEST_ADMIN to PDBADMIN';
   Execute Immediate 'Grant INSIGHT_AUTHOR to PDBADMIN';
   Execute Immediate 'Grant INSIGHT_ADMIN to PDBADMIN';
   Execute Immediate 'Grant INSIGHT$IMPL to PDBADMIN';
   Execute Immediate 'Grant ADPUSER to PDBADMIN';
   Execute Immediate 'Grant INGEST_REC_INTERNAL$IMPL to PDBADMIN';
   Execute Immediate 'Grant GRAPH_DEVELOPER to PDBADMIN';
   Execute Immediate 'Grant ODI_LINEAGE_USER to PDBADMIN';
   Execute Immediate 'Grant ODI_LINEAGE_ADMIN to PDBADMIN';
   Execute Immediate 'Grant ADPADMIN to PDBADMIN';
   Execute Immediate 'Grant DCAT_SYNC to PDBADMIN';
   Execute Immediate 'Grant ACCHK_READ to PDBADMIN';
   Execute Immediate 'Grant ODIADMIN to PDBADMIN';
   Execute Immediate 'Grant DATA_TRANSFORM_USER to PDBADMIN';
   Execute Immediate 'Grant PGX_SESSION_CREATE to PDBADMIN';
   Execute Immediate 'Grant PGX_SESSION_READ_MODEL to PDBADMIN';
   Execute Immediate 'Grant PGX_SESSION_MODIFY_MODEL to PDBADMIN';
   Execute Immediate 'Grant PGX_SESSION_NEW_GRAPH to PDBADMIN';
   Execute Immediate 'Grant PGX_SESSION_GET_PUBLISHED_GRAPH to PDBADMIN';

Exception
   when Others Then
   dbms_output.put_line('Failed grant statement: ' || sqlerrm || sqlcode ||'.');

End;
/