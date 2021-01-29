## Virtualservice quick start
1. Clone this project into the same local folder with azure-rest-api-specs.
2. npm install && npm run start.

It takes about two minutes to load all swagger files in the azure-rest-api-specs repo after the virtual service started. 
So please use it after "validator initialized" is shown in the console.

### Endpoints
After started, three ports are in LISTENNING state:
+ https://0.0.0.0:443, stateful;
+ http://0.0.0.0:80, stateless;
+ https://0.0.0.0:8443, stateless;
Since currently the HTTPS certificate is created with domain localhost, so the HTTTPS endpoints can only be visited though "localhost".

### What's stateful behaviour
+ Can only GET/DELETE after a Create.
+ Can only create sub resource after parent has already exist. For instance: should create resourceGroup-->virtual network-->subnet in sequence order.

## Adoption in Clients
After the virtual service is started in local computer, below section describe how to consume the virtual service in client side. 
### Azure CLI
```
# set AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1
# az cloud register -n virtualCloud --endpoint-resource-manager "https://localhost:8443"
# az cloud set -n virtualCloud
# az login --service-principal --username [USERNAME] --password [PASSWORD] --tenant [TENANT] // login with any realworld credential
# // try any az commands here
```

## What's next
+ create response by request