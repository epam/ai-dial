# Toolset Publications

## About Toolset Publications

DIAL users can publish their created toolsets to make them available to other users and applications. Published toolsets become available in the public folder and can be accessible to users and applications based on the access rules defined in the publication request. You can access published toolsets in [Assets/Toolsets](/docs/tutorials/3.admin/assets-toolsets.md) section. Published toolsets can be unpublished by DIAL admin or other DIAL users.

Toolsets can be published/unpublished using DIAL Core [API](https://dialx.ai/dial_api#tag/Publications/operation/createPublication) or in [DIAL Chat](/docs/tutorials/0.user-guide.md#publications).

In this section of the DIAL Admin panel, admins can access and approve or decline toolsets publication requests.

> * Refer to [Publications](/docs/platform/7.collaboration-intro.md#publication) to learn more about publications in DIAL.
> * Refer to [DIAL Chat User Guide](/docs/tutorials/0.user-guide.md#publications) to learn about the publication process from the perspective of a DIAL Chat end-user.

## Toolset Publications List

The Toolset Publications main screen displays all publish/unpublish requests submitted by DIAL users for toolsets using the DIAL API. 

![ ](img/136.png)

##### Toolset Publications Grid

| Field             | Definition|
|-------------------|----------|
| **Name**          | The title of the submitted publication request (not the toolset).         |
| **Author**        | The user who has submitted the publication request. Can be used to follow up with the creator if something needs clarification. |
| **Creation Time** | Submission's timestamp.              |

## Review Page

Click any publication request on the main screen to access the review page. On this page, you can inspect the selected request and decide whether to **Publish**, **Unpublish** or **Decline** it.

##### Publication Request Controls

On the top bar, you can find the following controls:

* **Publish**: Applies to publish requests. Use to approve the request.
* **Unpublish**: Applies to unpublish requests. Use to approve the request and remove the published toolset from the public folder and make it inaccessible to other users and applications.
* **Decline**: Reject the publish/unpublish request. Prompts you to enter a decline reason that will be sent back to the request author.

![](img/publish-toolset.png)

![](img/unpublish-toolset.png)

| Field              | Definition         |
|--------------------|-----------------------------------------------------------------------------------------------------|
| **Author**         | The user who has submitted the publication request. Can be used to follow up with the creator if something needs clarification. |
| **Creation Time**  | The publication request's submission timestamp.          |
| **Folder Storage** | The path to the file storage folder where the toolset assets will be saved in case it is published. |

### Properties Tab

The Properties tab shows the basic information about the toolset and related access rules. 

| Field  | Description|
|------------------------|------------|
| **Display Name**       | The name of the toolset assigned by the publication request author. |
| **Description**        | A free-text summary describing the toolset.     |
| **Icon**               | A logo to visually distinguish the toolset on the UI. Maximum size: 512 MB. Supported types: .jpeg, .jpg, .jpe, .png, .gif, .apng, .webp, .avif, .svg, .svgz, .bmp, .ico. Up to 1 files. |
| **Topics**             | Tags that you can assign to toolset. Helps to assign categories for better navigation on UI.  |
| **External Endpoint**  | Toolset API for MCP calls. The endpoint that a Quick App can call to fetch external data.  |
| **Transport**          | A transport supported by MCP server. The available options are: HTTP or SSE. Default: HTTP. Choose SSE for server-sent events when supported. |
|**Authentication**|Authentication settings for the Toolset. Supported OAUTH, API_KEY, or NONE. Refer to [DIAL Core](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/toolset_credentials_api.md) to learn more about toolset authentication.|
|**Permissions**|The proposed access rules to the published toolset (e.g., based on user group). Ensure the audience matches intended reach. If rules are not defined, the published resources will be available to all users. <br /> Available Controls:<br /> - **Review structure** opens a modal showing the storage folders tree and toolset's folder position in the hierarchy.<br />- **Compare changes** side-by-side diff of **current vs proposed** permission rules to the toolset's folder. Use to verify and validate changes in access rules before approving the publication request.|

![](img/137.png)

### Tools Overview Tab

Tools in toolsets are functionalities supported by a corresponding MCP server that can be used to extend the capabilities of the toolset. On this screen, you can find an overview of all tools included in the toolset submitted for publication.

![](img/138.png)
