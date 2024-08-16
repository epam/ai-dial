# Publications

## DIAL API

Refer to [AI DIAL API](#) to view publications endpoints.

### Workflows

TBD

#### Admins

* /v1/ops/publication/list
* /v1/ops/publication/get
* /v1/ops/publication/approve
* /v1/ops/publication/reject
* /v1/ops/publication/rules/list
* /v1/ops/publication/rules/update


#### Users

* /v1/ops/publication/list        
* /v1/ops/publication/get
* /v1/ops/publication/create
* /v1/ops/publication/delete

## DIAL Chat

Refer to [user guide](../user-guide#flow) to learn how chat users can use publications for conversations and prompts.

To enable the publication feature in AI DIAL Chat:

### Step 1: Users

Create configurations for your users in your identity service provider (IDP) and configure AI DIAL to work with it. Refer to [Web Auth](../Auth/Web/overview) to view the supported IDPs and examples.

### Step 2: AI DIAL Core

Configure AI DIAL Core to match claims from your IDP with the corresponding rules for users. Refer to [configuration](https://github.com/epam/ai-dial-core) to view the description of parameters.

You can create your own rules according to access policies in your organization. 

The following is the default configuration. In it, for admins, the value `admin` in the claim `roles` must be present. 

```json
"access": {
  "admin": {
    "rules": [
      {
        "function": "CONTAIN",
        "source": "roles",
        "targets": ["admin"]
      }
    ]
  }
}
```

### Step 3: AI DIAL Chat

Configure AI DIAL Chat by including `ConversationsPublishing` and `PromptsPublishing` in the `ENABLED_FEATURES` variable. Refer to [configuration](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md) to view the description of parameters and [examples](https://github.com/epam/ai-dial-chat/blob/development/libs/shared/src/types/features.ts).
