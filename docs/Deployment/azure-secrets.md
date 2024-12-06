# Using Secrets from Azure Key Vault in Helm Values

## Introduction

In this tutorial, you'll discover how to implement a configuration to securely retrieve and utilize secrets from Azure Key Vault in your Kubernetes pods using the Secrets Store CSI Driver.

Add this setup to your Helm deployment to manage secrets safely and effectively. The secrets will be stored as files inside the pod, making it easy and secure to integrate secret management with your applications.

> Refer to [Secrets Store CSI Driver in Azure](https://learn.microsoft.com/en-us/azure/aks/csi-secrets-store-driver) to learn how to add secrets.

## Step 1: Define SecretProviderClass

Add the following configuration to your Helm `values.yaml` file define the method for retrieving secrets from Azure Key Vault:

```yaml
extraDeploy:
  - apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: "${NAME}" # must be unique for each namespace
      namespace: "${NAMESPACE}"
    spec:
      provider: azure
      parameters:
        clientID: "${USER_ASSIGNED_CLIENT_ID}"
        cloudName: AzurePublicCloud
        keyvaultName: ${KEYVAULT_NAME}
        objects: |
          array:
            - |
              objectName: secret1
              objectType: secret
              objectVersion: ""
            - |
              objectName: secret2
              objectType: secret
              objectVersion: ""
        tenantID: "${IDENTITY_TENANT}"
        usePodIdentity: "false"
```

Replace the placeholders with your actual values:

* `${NAME}`: the name of the `SecretProviderClass`.
* `${NAMESPACE}`: the Kubernetes namespace where the resources will be deployed.
* `${USER_ASSIGNED_CLIENT_ID}`: `Client ID` of the user-assigned managed identity.
* `${KEYVAULT_NAME}`: the name of your Azure Key Vault.
* `${IDENTITY_TENANT}`: `Tenant ID` for your Azure Active Directory.

## Step 2: Mount Secrets to Pod

Configure the `extraVolumes` and `extraVolumeMounts` in your Helm `values.yaml` file to make the secrets accessible to your application:

```yaml
core:

  extraVolumes:
    - name: secrets
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "${NAME}"

extraVolumeMounts:
  - name: secrets
    readOnly: true
    mountPath: /mnt/secrets-store
```

## Step 3: Define Environment Variables

Specify the paths to the mounted secrets in your environment variables:

```yaml
core:

  env:
    aidial.config.files: >-
      [
      "/mnt/secrets-store/secret1",
      "/mnt/secrets-store/secret2"
      ]
```

## Configuration Examples

### Secrets for DIAL Chat

This example demonstrates how to utilize specific secrets from Azure Key Vault to create a Kubernetes secret for use in DIAL Chat.

#### Step 1: Define SecretProviderClass

Add the following to your Helm `values.yaml` file to define the `SecretProviderClass` for DIAL Chat:

```yaml
extraDeploy:
  - apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      namespace: "${NAMESPACE}"
      name: "${NAME}" # must be unique for each namespace
    spec:
      provider: azure
      parameters:
        usePodIdentity: "false"
        clientID: "${USER_ASSIGNED_CLIENT_ID}"
        cloudName: AzurePublicCloud
        keyvaultName: ${KEYVAULT_NAME}
        tenantID: "${IDENTITY_TENANT}"
        objects: |
          array:
            - |
              objectName: nextauth-secret
              objectType: secret
            - |
              objectName: auth-azuread-client-id
              objectType: secret
            - |
              objectName: auth-azuread-client-secret
              objectType: secret
      secretObjects:
        - secretName: "${SECRET_NAME}"
          type: Opaque
          data:
            - objectName: nextauth-secret
              key: NEXTAUTH_SECRET
            - objectName: auth-azuread-client-id
              key: AUTH_AZURE_AD_CLIENT_ID
            - objectName: auth-azuread-client-secret
              key: AUTH_AZURE_AD_SECRET
```

Replace the placeholders with your actual values:

* `${NAME}`: the name of the `SecretProviderClass`.
* `${NAMESPACE}`: the Kubernetes namespace where the resources will be deployed.
* `${USER_ASSIGNED_CLIENT_ID}`: `Client ID` of the user-assigned managed identity.
* `${KEYVAULT_NAME}`: the name of your Azure Key Vault.
* `${IDENTITY_TENANT}`: `Tenant ID` for your Azure Active Directory.
* `${SECRET_NAME}`: the Kubernetes secret name.

#### Step 2: Reference Kubernetes Secret

Reference the Kubernetes Secret in the DIAL Chat configuration:

```yaml
chat:

  extraEnvVarsSecret: "${SECRET_NAME}"

  extraVolumes:
    - name: secrets
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "${NAME}"

  extraVolumeMounts:
    - name: secrets
      readOnly: true
      mountPath: /mnt/secrets-store
```

### Secrets for DIAL Core

This example demonstrates how to utilize specific secrets from Azure Key Vault to create a Kubernetes secret for use in DIAL Core encryption.

#### Step 1: Define SecretProviderClass

Add the following to your Helm `values.yaml` file to define the `SecretProviderClass` for DIAL Core:

```yaml
extraDeploy:
  - apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      namespace: "${NAMESPACE}"
      name: "${NAME}" # must be unique for each namespace
    spec:
      provider: azure
      parameters:
        usePodIdentity: "false"
        clientID: "${USER_ASSIGNED_CLIENT_ID}"
        cloudName: AzurePublicCloud
        keyvaultName: ${KEYVAULT_NAME}
        tenantID: "${IDENTITY_TENANT}"
        objects: |
          array:
            - |
              objectName: encryption-secret
              objectType: secret
            - |
              objectName: encryption-key
              objectType: secret
      secretObjects:
        - secretName: "${SECRET_NAME}"
          type: Opaque
          data:
            - objectName: encryption-secret
              key: aidial.encryption.secret
            - objectName: encryption-key
              key: aidial.encryption.key
```

* `${NAME}`: the name of the `SecretProviderClass`.
* `${NAMESPACE}`: the Kubernetes namespace where the resources will be deployed.
* `${USER_ASSIGNED_CLIENT_ID}`: `Client ID` of the user-assigned managed identity.
* `${KEYVAULT_NAME}`: the name of your Azure Key Vault.
* `${IDENTITY_TENANT}`: `Tenant ID` for your Azure Active Directory.
* `${SECRET_NAME}`: the Kubernetes secret name.

#### Step 2: Reference Kubernetes Secret

Reference Kubernetes Secret in the DIAL Core configuration:

```yaml
core:

  configuration:
    encryption:
      existingSecret: "${SECRET_NAME}"

  extraVolumes:
    - name: secrets
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "${NAME}"
  extraVolumeMounts:
    - name: secrets
      readOnly: true
      mountPath: /mnt/secrets-store/dial-core-encryption
```
