## Virtualservice quick start
Please make sure nodejs is well installed in your computer before start.
1. Clone this project into the same local folder with azure-rest-api-specs.

2. download *.pem files for self-signed certificate.
~~~
# az login ...      // login azure cli with your credential
# cd avs
# . ./initiate.sh   // for LINUX or mac

or

> .\initiate.ps1    // for Windows, need to run in powershell
~~~
If failed for permission reasons, please contact changll@microsoft.com for authentication on keyvault used in the scripts. Or you may create self-signed key&cert by your self, the used files can be found in src/webserver/httpServerConstructor.ts  

3. start up
~~~
# npm install && npm run start
~~~
Common trouble shootings for starting the web server:
1. make sure ports used in avs aren't already been used by other process.
2. try to used sudo/"start as administrator" if failed to start listenning.

It takes about two minutes to load all swagger files in the azure-rest-api-specs repo after the virtual service started. 
So please use it (for instance by Postman) after "validator initialized" is shown in the console.

### Endpoints
After started, three ports are in LISTENNING state:
+ https://0.0.0.0:443, stateful;
+ http://0.0.0.0:80, stateless;
+ https://0.0.0.0:8443, stateless;
+ https://0.0.0.0:8445, always return 500 (except resourcegroup operations);

Since currently the HTTPS certificate is created with domain localhost, so the HTTTPS endpoints can only be visited though "localhost".

### What's stateful behaviour
+ Can only GET/DELETE after a Create.
+ Can only create sub resource after parent has already exist. For instance: should create resourceGroup-->virtual network-->subnet in sequence order.

## Adoption in Clients
After the virtual service is started in local computer, below section describe how to consume the virtual service in client side. 

### Azure CLI
```
# . venv/bin/activate               // assume the CLI is installed in this Python virtual environment
# 
# az login --service-principal --username [USERNAME] --password [PASSWORD] --tenant [TENANT] // login with any realworld credential
# set AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1
# az cloud register -n virtualCloud --endpoint-resource-manager "https://localhost:8443" --endpoint-active-directory https://login.microsoftonline.com --endpoint-active-directory-graph-resource-id https://graph.windows.net/ --endpoint-active-directory-resource-id https://management.core.windows.net/
# az cloud set -n virtualCloud
# // try any az commands here
```

### Use mock authentication
The Virtual service also provided mocked Microsoft OAuth service. If you don't want to use real-word authentication in virtual service, you can redirect login.microsoftonline.com to 127.0.0.1 in the hosts file in your OS, then use can login virtual service with any faked service principal.
``` (in C:\Windows\System32\drivers\etc\hosts for windows)
127.0.0.1 login.microsoftonline.com
```

## What's Next
+ mock response through example files
+ mock response by request
+ reported github issues.
