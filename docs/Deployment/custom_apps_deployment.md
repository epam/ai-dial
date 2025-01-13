# Custom Apps Deployment

## Introduction

Follow steps described in this guide, to deploy your custom application using a Helm chart and integrate it with AI DIAL Core configuration.

> * Refer to [User Guide](/docs/user-guide.md#applications-1) to learn about DIAL apps.
> * Refer to [DIAL Core dynamic setting](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json) to learn how to add apps to config.
> * Refer to [DIAL Helm](https://github.com/epam/ai-dial-helm) to view deployment examples.

## Step 1: Helm Deployment

> Refer to [DIAL Helm](https://github.com/epam/ai-dial-helm) to view deployment examples.

To deploy your custom application using Helm chart, run the following command:

```sh
helm install <application-name> dial/dial-extension -f ./values.yaml --version <chart-version> -n <namespace>
```

Replace the placeholders as follows:

* `<application-name>`: application's name. **Note:** make sure the name you provide is unique within the Kubernetes namespace to avoid conflicts.
* `<chart-version>`: the version of the Helm chart to be deployed. **Note:** make sure the chart version is compatible with application's requirements.
* `<namespace>`: the Kubernetes namespace where the application should be deployed.

Other notes:

* Make sure to include all the necessary configurations for application in the `<values.yaml>` file.
* Make sure that the Helm installation is successful and the application is running correctly within the Kubernetes cluster.

## Step 2: DIAL Core Configuration

Having successfully deployed your application using Helm chart, you can now add it to the DIAL Core dynamic settings configuration file. You application will be available after the deployment of DIAL Core with an updated configuration.

> Refer to [dynamic settings](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json) to view a full configuration example.

```json
//example of an extract from dynamic settings

"applications": {
  "application-name": {
    "endpoint": "http://<application-name>.<namespace>.svc.cluster.local/<application-name>/chat/completions",
    "displayName": "<application-display-name>",
    "iconUrl": "<icon-url>",
    "description": "<application-description>",
    "descriptionKeywords": ["<keyword-1>", "<keyword-2>"],
    "inputAttachmentTypes": ["*/*"],
    "features": {
      "urlAttachmentsSupported": true,
      "allowResume": false
    }
  }
}
```

> Refer to [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings) to view the description of parameters.
