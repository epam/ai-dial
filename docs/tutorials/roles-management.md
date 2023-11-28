# Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

This tutorial provides a guide on how to create these roles in both KeyCloak and MS Azure, and how to integrate them into AI DIAL's configuration.

> Refer to [AI DIAL Configuration](/docs/Deployment/configuration.md#proxyconfigjson-parameters) to learn more abour `roles` and other parameters. 

## KeyCloak

In this instruction, you will learn how to create roles in KeyCloak and add them to AI DIAL Models, Applications, Assistants, and Addons.

In KeyCloak **target realm**:

1. Create a group(s)
2. Create role(s)
3. Map roles to groups
4. Assign groups to users

In AI DIAL config:

5. Assign roles to AI DIAL Models, Applications, Assistants, and Addons.

AI DIAL Core receives the roles assigned to it through user access tokens (JWTs). These roles can be accessed via the path: `resource_access.<client-id>.roles` where `client-id` is a client registered in KeyCloak `realm`, e.g. `chatbot-ui`. 

### Step 1: Create groups 

> Refer to [KeyCloak Documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-managing-groups_server_administration_guide) to learn how to create groups.

In **Groups**, you can create a hierarchy of groups through admin console, similar to this example:

```
  Models
     -> AWS.Bedrock
     -> Stable.Diffusion
  Addons
     -> Wolfram   
```

### Step 2: Create roles

> Refer to [KeyCloak Documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#con-client-roles_server_administration_guide) to learn how to create roles.

1. In **Clients**, choose the client `chatbot-ui`.
2. In the table **Roles**, create required roles, for example:

  - AWS.Bedrock
  - Stable.Diffusion
  - Wolfram

### Step 3: Map roles to groups

In **Groups**, do the roles mapping for each group:

1. Open the tab **Role Mapping**
2. Press the button **Assign role** and choose a role you want to assign to a group

### Step 4: Assign groups to users

1. In **Groups**, choose a group you want to work with
2. In **Members**, press the button **Add member**
3. Select a member you want to assign to a group

> Refer to [KeyCloak Documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-managing-groups_server_administration_guide) for the detailed info about group assignments.

### Step 5: Assign KeyCloak roles to AI DIAL Core deployments

The last step is to assign KeyCloak roles to AI DIAL core deployments: Applications, Addons, Assistants and Models.

> Refer to [AI DIAL Configuration](./Deployment/configuration.md) to learn more.

```yaml
"addons": {
    "search": {
      "endpoint": "http://localhost:7010/search",
      "displayName": "Search",
      "userRoles": ["keycloak-role1"]
    }
 }

...

"applications": {
    "app": {
      "endpoint": "http://localhost:7001/openai/deployments/app/chat/completions",
      "userRoles": ["keycloak-role2"]
    }
  }

...

"assistant": {
        "endpoint": "http://assistant.dial-development/openai/deployments/assistant/chat/completions",
        "assistants": {
            "assistant-1": {
                "prompt": "Your system prompt.",
                "addons": [
                    "addon-1",
                    "addon-2"
                ],
                "userRoles": ["keycloak-role1"]
            }
        }
    }

...

"models": {
    "chat-gpt-35-turbo": {
      "type": "chat",      
      "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
      "upstreams": [
        {"endpoint": "http://localhost:7001", "key": "modelKey1"},
        {"endpoint": "http://localhost:7002", "key": "modelKey2"},
        {"endpoint": "http://localhost:7003", "key": "modelKey3"}
      ],
      "userRoles": ["keycloak-role2"]      
    }
}
```

## Microsoft Azure Active Directory

In this instruction, you will learn how to create roles in MS Azure Active Directory and add them to AI DIAL Models, Applications, Assistants, and Addons.

Group management process is consisted of three steps:

1. Create groups in Microsoft Azure Active Directory
2. Include groups into JWT custom `claim`
3. Assign roles to AI DIAL Models, Applications, Assistants, and Addons

The roles are provided to AI DIAL Core via user access token(JWT) by MS Azure AD and are available via the path: `groups`.

### Step 1: Create groups in Microsoft Azure Active Directory

1. In **Groups**, you can create groups that you need
2. Add members for each group

> Refer to [MS Documentation](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups) to view the detailed info about group management.

### Step 2: Include groups into JWT custom claim

1. In Microsoft Entra ID, open the item **App Registrations**
2. Open the application you want to configure groups for
3. Go to the item **Token Configuration**
4. Press the button **Add Groups claim** and customize which groups you want to include and where (access, ID token)
5. When customizing the claim **groups**, you can choose the option **sAMAccountName** instead of **Group ID** to include group names instead of group UUIDs in the token

> Refer to [MS Documentation](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) to view the detailed info about configuration of group claims for applications.

> **Note**: by default, the claim **groups** is not included into the access token. You should add a **scope** to the authorization request to obtain an access token.
> The **claim** is available in the ID token only.
> Refer to [stackoverflow](https://stackoverflow.com/questions/70542675/azure-ad-access-token-does-not-contain-groups-claim) to read more about this case.

How to create a custom **scope**:

1. Go to **Expose an API**
2. Set **Application ID URI** to something meaningful, e.g `api://chatbot-ui`
3. Press the button **Add a scope**
4. Fill the required fields in the form to create a new scope. Make sure **Who can consent?** is set to **Admin and users**.

Add the **scope** to the authorization request in `params`:

```
AzureProvider({
      clientId: process.env.AUTH_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
      name: process.env.AUTH_AZURE_AD_NAME ?? DEFAULT_NAME,
      authorization: {
        params: { scope: 'api://chatbot-ui/Client.Consumer openid profile user.Read email offline_access' },
      },
      token: tokenConfig,
    }),
```

> **Note**: if the custom `scope` is provided, the rest of `scopes` in the authorization request is ignored by Microsoft Azure AD.
> As a result, clients who have requested the access token do not have access to MS Azure Graph API for reading user info such as user picture and job title.

### Step 3: Assign MS Azure AD groups to AI DIAL Core deployments

The last step is to assign Microsoft Azure AD groups to AI DIAL Core deployments: Applications, Addons, Assistants and Models.

> Refer to [AI DIAL Configuration](./Deployment/configuration.md) to learn more.

> **Note**: in the example below, MS Azure groups are mapped to AI DIAL Core user roles one to one.

```yaml
"addons": {
    "search": {
      "endpoint": "http://localhost:7010/search",
      "displayName": "Search",
      "userRoles": ["azure-group1"]
    }
 }

...

"applications": {
    "app": {
      "endpoint": "http://localhost:7001/openai/deployments/app/chat/completions",
      "userRoles": ["azure-group2"]
    }
  }

...

"assistant": {
        "endpoint": "http://assistant.dial-development/openai/deployments/assistant/chat/completions",
        "assistants": {
            "assistant-1": {
                "prompt": "Your system prompt.",
                "addons": [
                    "addon-1",
                    "addon-2"
                ],
                "userRoles": ["azure-group1"]
            }
        }
    }

...

"models": {
    "chat-gpt-35-turbo": {
      "type": "chat",      
      "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
      "upstreams": [
        {"endpoint": "http://localhost:7001", "key": "modelKey1"},
        {"endpoint": "http://localhost:7002", "key": "modelKey2"},
        {"endpoint": "http://localhost:7003", "key": "modelKey3"}
      ],
      "userRoles": ["azure-group2"]      
    }
}
```
