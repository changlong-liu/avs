import * as express from "express"

function mockLogin(app: any | express.Express) {
    const jwt = {
        "token_type": "Bearer",
        "expires_in": "86399",
        "ext_expires_in": "86399",
        "expires_on": "1609221607",
        "not_before": "1609134907",
        "resource": "https://management.azure.com/",
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVPZjlQNUY5Z0NDd0NtRjJCT0hIeEREUS1EayIsImtpZCI6IjVPZjlQNUY5Z0NDd0NtRjJCT0hIeEREUS1EayJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE2MDkxMzQ5MDcsIm5iZiI6MTYwOTEzNDkwNywiZXhwIjoxNjA5MjIxNjA3LCJhaW8iOiJFMkpnWURqMCsxa1J3NlNhZ2dtT1FzWXNiNjIrQVFBPSIsImFwcGlkIjoiYzc3Y2NiMjktODdlNC00NjMzLWFmYjItZGM5YjRiZDkzOGRjIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsIm9pZCI6IjRmYWEzMmZkLTk2M2EtNDY0ZC1iNmJmLWMxMmNmNDhjMDMxNyIsInJoIjoiMC5BUUVBdjRqNWN2R0dyMEdScXkxODBCSGJSeW5MZk1ma2h6TkdyN0xjbTB2Wk9Od2FBQUEuIiwic3ViIjoiNGZhYTMyZmQtOTYzYS00NjRkLWI2YmYtYzEyY2Y0OGMwMzE3IiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiOGdFR1pWbkV2VVdTNElqc19uVWpBQSIsInZlciI6IjEuMCIsInhtc190Y2R0IjoxMjg5MjQxNTQ3fQ.jdm9zo1LJwhwyFaX3ZX5p7y3T_JPZ_YJRsqgzvpSsI1zrmanZosaHqtYcVC1jgKFKIeCBtQVqMEwSXgElHBS9d3S0eovERJ5G_2AcdlTTWSZglmMae6N9OFWT_uA9zZrymrkVsKdWN7ewXEZwYHO-RnM2uW5ktEOKfLa0hIlaf6r8A60uLADBYtABYEkRZCA5jbT7gobaDPdzrTEn93e-05XczYfDVron4Spby8tLQ8Panz1O-OEa1IKrs-QltmOnEj42gZncQU6KEqfXXAmyC0MmHXJjYkJxomSm-WlSsTJ_huFEOy_f4KkJAm1IedxhlmagnNvVcNPgRJEFhufmg"
    };
    app.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', (req: express.Request, res: express.Response) => {
        res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(jwt));
    })
}

function mockFingerPrint(app: any | express.Express) {
    const result = {
        "token_endpoint": "https://localhost/common/oauth2/token",
        "token_endpoint_auth_methods_supported": [
            "client_secret_post",
            "private_key_jwt",
            "client_secret_basic"
        ],
        "jwks_uri": "https://localhost/common/discovery/keys",
        "response_modes_supported": [
            "query",
            "fragment",
            "form_post"
        ],
        "subject_types_supported": [
            "pairwise"
        ],
        "id_token_signing_alg_values_supported": [
            "RS256"
        ],
        "response_types_supported": [
            "code",
            "id_token",
            "code id_token",
            "token id_token",
            "token"
        ],
        "scopes_supported": [
            "openid"
        ],
        "issuer": "https://sts.microsoftonline.de/{tenantid}/",
        "microsoft_multi_refresh_token": true,
        "authorization_endpoint": "https://localhost/common/oauth2/authorize",
        "device_authorization_endpoint": "https://localhost/common/oauth2/devicecode",
        "http_logout_supported": true,
        "frontchannel_logout_supported": true,
        "end_session_endpoint": "https://localhost/common/oauth2/logout",
        "claims_supported": [
            "sub",
            "iss",
            "cloud_instance_name",
            "cloud_instance_host_name",
            "cloud_graph_host_name",
            "msgraph_host",
            "aud",
            "exp",
            "iat",
            "auth_time",
            "acr",
            "amr",
            "nonce",
            "email",
            "given_name",
            "family_name",
            "nickname"
        ],
        "check_session_iframe": "https://localhost/common/oauth2/checksession",
        "userinfo_endpoint": "https://localhost/common/openid/userinfo",
        "tenant_region_scope": null,
        "cloud_instance_name": "microsoftonline.de",
        "cloud_graph_host_name": "graph.cloudapi.de",
        "msgraph_host": "graph.microsoft.de",
        "rbac_url": "https://pas.cloudapi.de"
    };
    app.get('/common/.well-known/openid-configuration', (req: express.Request, res: express.Response) => {
        res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(result));
    })
}
function mockServiceDiscovery(app: any | express.Express) {
    const result = {
        "tenant_discovery_endpoint": "https://localhost/common/.well-known/openid-configuration"
    };
    app.get('/common/discovery/instance', (req: express.Request, res: express.Response) => {
        res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(result));
    })
}

function mockGetSubscriptions(app: any | express.Express) {
    // const result = {"value":[{"id":"/subscriptions/8c4b5b03-3b24-4ed0-91f5-a703cd91b412","authorizationSource":"RoleBased","subscriptionId":"8c4b5b03-3b24-4ed0-91f5-a703cd91b412","displayName":"Cosmos_C&E_Azure_AzureEngineeringSystems_100200","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/eef8b6d5-94da-4b36-9327-a662f2674efb","authorizationSource":"RoleBased","subscriptionId":"eef8b6d5-94da-4b36-9327-a662f2674efb","displayName":"AISC-EngSys-01","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/7fd08dcc-a653-4b0f-8f8c-4dac889fdda4","authorizationSource":"RoleBased","subscriptionId":"7fd08dcc-a653-4b0f-8f8c-4dac889fdda4","displayName":"Code generate Test and Infra","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/a18897a6-7e44-457d-9260-f2854c0aca42","authorizationSource":"RoleBased","subscriptionId":"a18897a6-7e44-457d-9260-f2854c0aca42","displayName":"Azure SDK Engineering System","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/dad45786-32e5-4ef3-b90e-8e0838fbadb6","authorizationSource":"RoleBased","subscriptionId":"dad45786-32e5-4ef3-b90e-8e0838fbadb6","displayName":"AnE.ExP.Production","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/482e1993-01d4-4b16-bff4-1866929176a1","authorizationSource":"RoleBased","subscriptionId":"482e1993-01d4-4b16-bff4-1866929176a1","displayName":"Epic-Edge-ES-MergeResolver","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/e01de573-132a-42ac-9ee2-f9dea9dd2717","authorizationSource":"RoleBased","subscriptionId":"e01de573-132a-42ac-9ee2-f9dea9dd2717","displayName":"Cosmos_WDG_Core_BnB_100292","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/83a9a25f-d922-437f-bc5b-79f3b6827513","authorizationSource":"RoleBased","subscriptionId":"83a9a25f-d922-437f-bc5b-79f3b6827513","displayName":"ES-ESP-AS-vPack-Prod","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/4115b323-4aac-47f4-bb13-22af265ed58b","authorizationSource":"RoleBased","subscriptionId":"4115b323-4aac-47f4-bb13-22af265ed58b","displayName":"ES-ESP-AS-vPack-Nonprod","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/4d747266-6ac4-4929-89e2-4cfe9a71858b","authorizationSource":"RoleBased","subscriptionId":"4d747266-6ac4-4929-89e2-4cfe9a71858b","displayName":"MSRCSUPP Non-Express Prod CC70550","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/9ec1d932-0f3f-486c-acc6-e7d78b358f9b","authorizationSource":"RoleBased","subscriptionId":"9ec1d932-0f3f-486c-acc6-e7d78b358f9b","displayName":"TScience","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/92f95d8f-3c67-4124-91c7-8cf07cdbf241","authorizationSource":"RoleBased","subscriptionId":"92f95d8f-3c67-4124-91c7-8cf07cdbf241","displayName":"Python NodeJS Test with TTL = 7 days","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/3c69a94e-4f48-4b8b-8bdf-aff82fa0ac9c","authorizationSource":"RoleBased","subscriptionId":"3c69a94e-4f48-4b8b-8bdf-aff82fa0ac9c","displayName":"Microsoft Services Disaster Response","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/96f7a6ad-39d4-42e5-b676-a510a9e6fd22","authorizationSource":"RoleBased","subscriptionId":"96f7a6ad-39d4-42e5-b676-a510a9e6fd22","displayName":"COSINE-ES-FailureAnalysis","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/02d68940-61e6-42d0-81d1-8396b7451114","authorizationSource":"RoleBased","subscriptionId":"02d68940-61e6-42d0-81d1-8396b7451114","displayName":"Linux Microservices PROD","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/8cff5d56-95fb-4a74-ab9d-079edb45313e","authorizationSource":"RoleBased","subscriptionId":"8cff5d56-95fb-4a74-ab9d-079edb45313e","displayName":"Skype-NetEM-PROD","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/8a6e61f6-4dae-4242-b835-83b8aafcbbed","authorizationSource":"RoleBased","subscriptionId":"8a6e61f6-4dae-4242-b835-83b8aafcbbed","displayName":"DESP-APT-MTB-Prod","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/ae71ef11-a03f-4b4f-a0e6-ef144727c711","authorizationSource":"RoleBased","subscriptionId":"ae71ef11-a03f-4b4f-a0e6-ef144727c711","displayName":"Bing MM Measurement","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/eec2de82-6ab2-4a84-ae5f-57e9a10bf661","authorizationSource":"RoleBased","subscriptionId":"eec2de82-6ab2-4a84-ae5f-57e9a10bf661","displayName":"ServicesPortfolio MCS","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/d21a0e9f-5e29-4b39-8ba5-0e189bc5fe2d","authorizationSource":"RoleBased","subscriptionId":"d21a0e9f-5e29-4b39-8ba5-0e189bc5fe2d","displayName":"Edge DevTools Client","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/c1c21d53-ea09-4dcf-9c3d-a86941c960cc","authorizationSource":"RoleBased","subscriptionId":"c1c21d53-ea09-4dcf-9c3d-a86941c960cc","displayName":"ADM Dev + Test","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/cd0fa82d-b6b6-4361-b002-050c32f71353","authorizationSource":"RoleBased","subscriptionId":"cd0fa82d-b6b6-4361-b002-050c32f71353","displayName":"Falcon Dev Cluster","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/c59ea945-6d69-43cb-8cf5-7674fc245c37","authorizationSource":"RoleBased","subscriptionId":"c59ea945-6d69-43cb-8cf5-7674fc245c37","displayName":"DD-VSO-Dogfood","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a","authorizationSource":"RoleBased","subscriptionId":"6560575d-fa06-4e7d-95fb-f962e74efd7a","displayName":"ML Lifecycle PM","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/d03b04c7-d1d4-467b-aaaa-87b6fcb38b38","authorizationSource":"RoleBased","subscriptionId":"d03b04c7-d1d4-467b-aaaa-87b6fcb38b38","displayName":"VSEng Shared","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/26b9b438-7fe8-482f-b732-ea99c70f2abb","authorizationSource":"RoleBased","subscriptionId":"26b9b438-7fe8-482f-b732-ea99c70f2abb","displayName":"ddverify","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/8bc2f89b-c4f6-4559-ad6a-4f2cfa6ccc49","authorizationSource":"RoleBased","subscriptionId":"8bc2f89b-c4f6-4559-ad6a-4f2cfa6ccc49","displayName":"VSEng MadDog-RPS Telemetry","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/eb87f285-893a-4f0f-8c55-7b4f67b1d097","authorizationSource":"RoleBased","subscriptionId":"eb87f285-893a-4f0f-8c55-7b4f67b1d097","displayName":"CAT_Eng","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/58706c15-d8a1-4397-af3c-e1ebf1cbebe5","authorizationSource":"RoleBased","subscriptionId":"58706c15-d8a1-4397-af3c-e1ebf1cbebe5","displayName":"RPS-cloud-common-2","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/52a442a2-31e9-42f9-8e3e-4b27dbf82673","authorizationSource":"RoleBased","subscriptionId":"52a442a2-31e9-42f9-8e3e-4b27dbf82673","displayName":"Core-ES-WorkManagement","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/33b1bf3d-53dc-432d-ac1c-ae964ceb1c9b","authorizationSource":"RoleBased","subscriptionId":"33b1bf3d-53dc-432d-ac1c-ae964ceb1c9b","displayName":"AzureDevOpsCommunity","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/bd62906c-0a81-43c3-a2f8-126e4cf66ada","authorizationSource":"RoleBased","subscriptionId":"bd62906c-0a81-43c3-a2f8-126e4cf66ada","displayName":"DevDiv Key Vault","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/00c06639-6ee4-454e-8058-8d8b1703bd87","authorizationSource":"RoleBased","subscriptionId":"00c06639-6ee4-454e-8058-8d8b1703bd87","displayName":"AI Infra Build","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/85b3dbca-5974-4067-9669-67a141095a76","authorizationSource":"RoleBased","subscriptionId":"85b3dbca-5974-4067-9669-67a141095a76","displayName":"Terraform Testing on Azure with TTL = 2 Days","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}},{"id":"/subscriptions/cd13cb44-05a2-4dcb-8963-a512f9e672e2","authorizationSource":"RoleBased","subscriptionId":"cd13cb44-05a2-4dcb-8963-a512f9e672e2","displayName":"XTest IaaS VMs","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Internal_2014-09-01","quotaId":"Internal_2014-09-01","spendingLimit":"Off"}}]};
    const result = {"value":[
            {
                "cloudName": "mock",
                "homeTenantId": "00000000-0000-0000-0000-000000000000",
                "id": "00000000-0000-0000-0000-000000000000",
                "isDefault": false,
                "managedByTenants": [
                    {
                        "tenantId": "00000000-0000-0000-0000-000000000000"
                    }
                ],
                "name": "Code generate Test and Infra",
                "state": "Enabled",
                "tenantId": "00000000-0000-0000-0000-000000000000",
                "user": {
                    "name": "00000000-0000-0000-0000-000000000000",
                    "type": "servicePrincipal"
                }
            }
        ]};
    app.all('/subscriptions', (req: express.Request, res: express.Response) => {
        res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(result));
    })
}

export function mockAuthServer(app: any) {
    mockGetSubscriptions(app);
    mockLogin(app);
    mockFingerPrint(app);
    mockServiceDiscovery(app);
}
