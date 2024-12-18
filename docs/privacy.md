# PII Compliance & Privacy

## Introduction

There are two scenarios in which personal information can be exposed when working with DIAL. 

* The first scenario takes place when an application uploads sensitive data, such as conversations or files, to DIAL via API. In this case, DIAL can capture and save conversation data in application audit logs.
* The second scenario occurs when users interact with DIAL Chat, specifically when engaging with language models or applications. In this case, DIAL can capture and save conversation data in both audit logs and the user’s BLOB storage.

To ensure compliance with necessary Personally Identifiable Information (PII) regulations, our system offers flexibility that allows you to customize your data management strategy and ensure that your data handling practices adhere to required standards. 

DIAL allows you to choose which logs to store (if at all), determine which data to retain, and assists in implementing necessary policies in your file storage to effectively manage sensitive resources. 

## Applications Audit Logs

When a user interacts with DIAL applications programmatically using API keys, DIAL captures and records all conversation data in a designated audit log. 

To prevent DIAL from storing such logs for a particular API key, you can enable a special flag in the API key specification in the [DIAL Core dynamic settings](https://github.com/epam/ai-dial-core/?tab=readme-ov-file#dynamic-settings): 

```json
//Example of DIAL Core dynamic settings configuration
"keys": 
{
        "yourApiKey": {
            "secured": true
        }        
}
```

**Important!**: It's important to be aware that custom applications can upload resources, like conversations or files, to DIAL. If this is the case, the logic within the custom application that carries out such actions is responsible for handling these resources. To manage them, you can additionally implement Time To Live (TTL) or other policies in your file storage. For more details on this topic, please refer to the [File Storage Policies](#file-storage-policies) section.

## BLOB Storage

When a user interacts with DIAL Chat using a JSON Web Token (JWT), DIAL captures and records all conversation data in a designated audit log and **also** stores it as JSON files in the user's BLOB storage.

**Important!**: It's important to be aware that even if a user deletes all conversation data from the BLOB storage the data will still be retained in the audit logs. Because DIAL Chat uses JWT for user authentication, rather than API keys, the information will inevitably be saved in BLOB storage.

## File Storage Policies

To manage your resource uploaded to the BLOB storage, you can configure policies, which operate independently from DIAL. BLOB storage policies can utilize functionalities such as cloud lambdas to establish TTLs for specific file types. 

To facilitate the enforcement of such policies, DIAL can add metadata to files stored in the BLOB storage. This metadata assists in the application of storage policies, ensuring effective management of your resources.
