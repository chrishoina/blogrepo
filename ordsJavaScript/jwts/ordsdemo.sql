DECLARE
  l_roles     OWA.VC_ARR;
  l_modules   OWA.VC_ARR;
  l_patterns  OWA.VC_ARR;

BEGIN
  ORDS.DEFINE_MODULE(
      p_module_name    => 'alpha.group.module.v1',
      p_base_path      => '/alpha_v1/',
      p_items_per_page => 25,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);

  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'alpha.group.module.v1',
      p_pattern        => 'alpha_group',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);

  ORDS.DEFINE_HANDLER(
      p_module_name    => 'alpha.group.module.v1',
      p_pattern        => 'alpha_group',
      p_method         => 'GET',
      p_source_type    => 'plsql/block',
      p_items_per_page => 25,
      p_mimes_allowed  => NULL,
      p_comments       => NULL,
      p_source         => 
'DECLARE
  l_json VARCHAR2(1000);
BEGIN
    l_json := ''{"data":"You are authorized to view this ALPHA group resource."}'';
    htp.p(l_json);
END;');

  ORDS.DEFINE_MODULE(
      p_module_name    => 'beta.group.module.v1',
      p_base_path      => '/beta_v1/',
      p_items_per_page => 25,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);

  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'beta.group.module.v1',
      p_pattern        => 'beta_group',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);

  ORDS.DEFINE_HANDLER(
      p_module_name    => 'beta.group.module.v1',
      p_pattern        => 'beta_group',
      p_method         => 'GET',
      p_source_type    => 'plsql/block',
      p_items_per_page => 25,
      p_mimes_allowed  => NULL,
      p_comments       => NULL,
      p_source         => 
'DECLARE
  l_json VARCHAR2(1000);
BEGIN
    l_json := ''{"data:""You are authorized to view this BETA group resource."}'';
    htp.p(l_json);
END;');

    
  ORDS.CREATE_ROLE(p_role_name => 'alphagroup');
  ORDS.CREATE_ROLE(p_role_name => 'betagroup');
    
  l_roles(1) := 'alphagroup';
  l_modules(1) := 'alpha.group.module.v1';

  ORDS.DEFINE_PRIVILEGE(
      p_privilege_name => 'alphagroup',
      p_roles          => l_roles,
      p_patterns       => l_patterns,
      p_modules        => l_modules,
      p_label          => 'alphagroup',
      p_description    => 'alphagroup',
      p_comments       => 'alphagroup'); 

  l_roles.DELETE;
  l_modules.DELETE;
  l_patterns.DELETE;
    
  l_roles(1) := 'betagroup';
  l_modules(1) := 'beta.group.module.v1';

  ORDS.DEFINE_PRIVILEGE(
      p_privilege_name => 'betagroup',
      p_roles          => l_roles,
      p_patterns       => l_patterns,
      p_modules        => l_modules,
      p_label          => 'betagroup',
      p_description    => 'betagroup',
      p_comments       => 'betagroup'); 

  l_roles.DELETE;
  l_modules.DELETE;
  l_patterns.DELETE;
    
        
COMMIT;

END;