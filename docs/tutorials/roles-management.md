
# Roles Management for API Keys

> Refer to IDP Configuration to learn how to set and configure supported identity providers.

## Introduction

External systems can communicate with AI DIAL via its APIs using API keys. To authorize and authenticate API keys, you can set and configure roles and limits applicable to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame.

**To authenticate and authorize an API key:**

1. AI DIAL Core config is checked to see if a particular API Key is included. 
2. If the first requirement is met, the system checks its roles and limits. In case the limit is exceeded or access to a particular requested AI DIAL resource is not specified, API Key's access is rejected. 

## AI DIAL Core Configuration

In [AI DIAL Core dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings), you can define API keys, their roles and limits.

### Define API Keys

In the `keys` section in the `aidial.config.json` file, you can add API keys ("proxyKey1" in the example below) and assign them `project` and `role`. Note, that you can assign only roles that are defined in the `roles` section - see [further in text](#define-roles-and-limits). 

> API Key should be a secure random key of at least 128 bit size.

> Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json) to view the full example.

```json
//Example extract from aidial.config.json
"keys": {
    "proxyKey1": {
        "project": "Project1",
        "role": "default"
    },
    "proxyKey2": {
        "project": "Project2",
        "role": "role1"
    }
}
```

### Define Roles and Limits

In the `roles` section in the `aidial.config.json` file, you can add roles ("default" and "role1" in the example below), which you can assign to API keys. Each role can have `limits` - a number of tokens (unlimited by default) that can be transmitted in a specific time frame (`minute` or `day`) to AI DIAL Models, Applications, Addons, and Assistants. 

> Refer to [AI DIAL Core documentation](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings) to view the description of parameters.

> Note, that unless a Model, Application, Addon or Assistants is explicitly specified in the config ("chat-gpt-35-turbo" model is specified in the example below), access to it is prohibited for the API key that requested it.

> Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json) to view the full example.

```Json
//Example extract from aidial.config.json
"keys": {
    "proxyKey1": {
        "project": "Project1",
        "role": "default"
    },
    "proxyKey2": {
        "project": "Project2",
        "role": "role1"
    }
},
"roles": {
    "default": { //role name
        "limits": {
            "chat-gpt-35-turbo": { //model name
                "minute": "100000", //overrides the default value
                "day": "10000000"
            }
        }
    },
    "role1": {
        "limits": {
            "chat-gpt-35-turbo": {} // the default value applies - unlimited
        }
    },
}
```
