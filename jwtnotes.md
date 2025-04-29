Roles from user attributes 

```sh
curl -i -X POST https://(DOMAIN URL)/admin/v1/CustomClaims -H"Cache-Control: no-cache" -H"Accept:application/json" -H"Content-Type:application/json" -H"Authorization: Bearer $ACCESS_TOKEN" -d '{
    "schemas": [
        "urn:ietf:params:scim:schemas:oracle:idcs:CustomClaim"
    ],
    "name": "myjwtroles",
    "value": "$user.urn:ietf:params:scim:schemas:idcs:extension:custom:User.myjwtroles.*",     
    "expression": true,
    "mode": "always",
    "tokenType": "AT",
    "allScopes": false,
    "scopes": [
    "audience01/roles"
  ]
}'
```

{
    "schemas": [
        "urn:ietf:params:scim:schemas:oracle:idcs:CustomClaim"
    ],
    "name": "roles",
    "value": "$user.groups.*.display",     
    "expression": true,
    "mode": "always",
    "tokenType": "AT",
    "allScopes": false,
    "scopes": [
    "audience01/roles"
  ]
}