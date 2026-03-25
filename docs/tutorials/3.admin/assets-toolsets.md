# Toolsets

## Introduction

Toolsets in DIAL enable connectivity with MCP servers and can be used as tools by any internal or external application to perform specific actions. Refer to [Video Demo](/docs/video%20demos/2.Applications/5.quick-apps.md) to watch how tools are used in [DIAL Quick Apps 2.0](/docs/platform/3.core/7.apps.md#quick-apps-20).

In DIAL, toolsets created by users (either using DIAL Core API or UI) are stored in a private folder of a dedicated user in the DIAL file storage and are not accessible to anyone but the toolset author (owner). To enable access for other users, toolsets owners can publish them or DIAL administrators can manually add them to the Public folder, where all published resources are stored.

> Refer to [Entities/Toolsets](/docs/tutorials/3.admin/entities-toolsets.md) to learn more.

## Main Screen

The Assets/Toolsets screen displays all toolsets located in the Public folder in DIAL file storage. Toolsets get to the Public folder when published by users or added by administrators.

> **Note**: This screen, does not give access to private toolsets of users.

> * Refer to [Access Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about Private and Public logical spaces for objects storage in DIAL.
> * Refer to [Chat User Guide](/docs/tutorials/0.user-guide.md#to-publish-toolset) to learn how end users can publish toolsets and to [DIAL Core API Publications](https://dialx.ai/dial_api#tag/Publications) to learn how to create and manage publication requests via API.

![ ](img/131.png)

##### Public file storage

Objects in the [Public folder](/docs/platform/3.core/2.access-control-intro.md) are arranged hierarchically, similar to a file system. 

- **Root folder**: Public is a root folder with sub-folders. It is visible to all authorized users. If a sub-folder is not specified for the new object being published, it is placed in the root folder by default.
- **Sub-folders**: Objects can be placed in sub-folders for logical organization purposes - one object per sub-folder is recommended. 

> **Note**, that access rules can be applied to sub-folders (manually or in publication request). You can view and manage access rules in [Folders Storage](/docs/tutorials/3.admin/access-management-folders-storage.md). The effective authorization rule for an object in a sub-folder includes restrictions applied to all parent sub-folders up to the root folder. Refer to [Tutorials](/docs/tutorials/1.developers/1.work-with-resources/0.work-with-publications.md#effective-rules) to learn about affective rules for folders.

| Available Actions | Description |
|-------------------|-------------|
| **Create sub-folder + import objects** | Hover over any folder to display the **+** icon. It allows importing objects into new child or sibling sub-folders. <br />The process is similar to [Import](#import), but you’ll need to provide a name for the new folder. <br />Additionally, there’s an optional step where you can define [access rules](/docs/tutorials/3.admin/access-management-folders-storage.md#access-rules) for the new sub-folder. <br />**Note**: New sub-folders can only be created using this method or as part of a publication request if a new folder is specified during that process. |
| **Actions** | Hover over any folder to view a context menu icon with actions you can perform in relation to the selected folder.<br /> - **Rename**: Use to rename the selected folder. <br />- **Move to**: Use to select a target location in the hierarchy to move the selected folder.<br />- **Manage permissions**: Redirects to [Folder Storage](/docs/tutorials/3.admin/access-management-folders-storage.md) to manage access to the folder.<br />- **Delete**: Use to delete the folder with objects inside it.|

![ ](img/folder-actions.png)

##### Toolsets grid

Click any folder to display its content in the toolsets grid.

| Column | Description |
|--------|-------------|
| **ID** | Toolset's unique identified. |
| **Version** | Version of the toolset. |
| **Author** | Username or system ID associated with the user who created or last updated this toolset. |
| **Updated time** | Timestamp of the last update. |
| **Actions** | Actions you can perform on the selected toolset:<br />- **Open in new tab**: Opens the toolset's properties, features, and parameters in a new tab.<br />- **Move to another folder**: Select a target folder in the hierarchy to move the toolset.<br />- **Delete**: Remove the toolset. You can also use **Bulk Actions** in the toolbar to delete multiple toolsets at once.<br />- **Duplicate**: Create a copy of the toolset in one of two ways:<br />**New version**: Creates another version of the selected toolset. You can also quickly add a new version on the [Configuration](#configuration) screen by clicking **Create** in the **Version** dropdown.<br />**New toolset**: Clones the selected toolset as a new one. |

![ ](img/assets-toolsets-actions.png)

## Export

Use **Bulk Actions** in the toolbar to download selected toolsets. This is useful for migrating toolsets between environments, sharing sets of toolsets with other users, or keeping a point-in-time backup.

![ ](img/apps_bulk_actions.png)

##### To export toolsets:

1. Click **Bulk Actions** button in the toolbar.
2. Select toolsets by checking the boxes in each row. You can also select the version you want to export. 
3. Click **Export** in the bottom to launch the export modal.
4. In the modal window select the export format: ZIP Archive or JSON.
5. Click **Export** to generate export file and start downloading.  

## Import

Use **Import** in the toolbar to upload new or update existing toolsets from ZIP archive. This is essential for migrating, restoring, or sharing toolsets assets between DIAL users.

##### To import toolsets:

1. Click **Import** in the toolbar to launch the import modal.
2. **Drag & Drop** your DIAL Admin archive into the files area or click **Browse** to open a file picker.

    ![ ](img/140.png)

3. Select a Conflict resolution strategy. It allows you to decide how to handle existing toolsets with the same identifier and version:
   * **Skip**: Leave existing toolsets untouched, only new ones will be added.
   * **Override**: Replace toolsets having the same name and version with the imported ones.
4. Use **Ignore paths** toggle to skip folder structure from the imported files. When enabled, all toolsets will be imported directly into the root folder without recreating the original folder hierarchy.
5. Click **Finish** to start.

    ![ ](img/141.png)

## Create

On the main screen you can add new toolsets to the public folder.

> **Tip**: You can quickly add new toolsets by duplicating existing ones. Use the **Duplicate** action in the toolset's context menu.

Follow these steps to add a new toolset: 

1. Click **+ Create** to invoke the **Create Toolset** modal.

    | Field | Required | Description |
    |-------|----------|-------------|
    | **ID** | Yes | Unique identifier of the toolset. |
    | **Display Name** | Yes | Name of the toolset displayed on UI. |
    | **Version** | Yes | Semantic identifier (e.g., 1.2.0) of a toolset's version. |
    | **Description** | No | Description of a toolset. |
    | **External Endpoint** | Yes | Endpoint DIAL Core will use to communicate with the related MCP server. |

3. Once all required fields are filled click **Create**. The dialog closes and the new [toolset configuration](#configuration) screen is opened. This entry will appear immediately in the listing under the selected folder once created.

    ![](img/132.png)

## Delete

There are several ways to delete an application or a specific version of it:

* Click **Delete** in the toolbar on the Configuration screen to permanently remove the selected toolset from your DIAL instance.
* Use the Delete option in the toolset context menu.
* Delete the related folder where the toolset is located.
* Use **Bulk Actions** on the main screen to delete more than one toolset.

![](img/assets-delete-toolset.png)

## Configuration

Click any toolset on the main screen to open a screen with information about the selected toolset and its configuration details.

### Properties

In the **Properties** tab, you can preview and modify selected toolset's basic properties.

![](img/134.png)

##### Available actions

You can find the following action buttons in the configuration screen header:

| Action | Description |
|--------|-------------|
| **Version**  | Version of the toolset. Can be selected from the dropdown to display properties for different versions of toolset. <br /> In the dropdown, click **Create** to add a new version of the toolset. |
| **Delete** | Use to delete the selected toolset. |

##### Fields description

| Field | Required | Editable | Description |
|-------|----------|----------|-------------|
| **ID** | - | No | Unique identifier of the toolset. It is read-only but includes a copy-to-clipboard button for easy reference. |
| **Author** | - | No | User who created toolset. |
| **Updated Time** | - | No | Timestamp of the last update. |
| **Creation Time** | - | No | Creation timestamp. |
| **Authentication** | - | No | Current authentication status of the selected toolset: <br />- **Logged out**: The toolset in not authenticated with the related MCP server. <br />- **Logged in (Personal)**: The toolset is authenticated for your user only. <br />- **Logged in (Organization)**: The toolset is authenticated for all users in your organization. |
| **Folder Storage** | - | No | Path to the toolset's location in the hierarchy within the public folder. Click to navigate to [Folders Storage](/docs/tutorials/3.admin/access-management-folders-storage.md). |
| **Display Name** | Yes | Yes | The name of the toolset displayed on UI. |
| **Description** | No | Yes | Toolset description. |
| **Icon** | No | Yes | Logo of the toolset displayed on UI.<br />Maximum size: 512 MB.<br />Supported types: .jpeg, .jpg, .jpe, .png, .gif, .apng, .webp, .avif, .svg, .svgz, .bmp, .ico. |
| **Topics** | No | Yes | Topics are semantic labels that you can assign to toolsets (e.g. "finance", "support") for better navigation on UI. Click to display a list of available topics. <br /> You can add your own custom topics to the list following these rules:<br />- The topic name must not exceed 255 characters.<br />- The topic name must not contain leading or trailing spaces. |
| **Storage folder** | Yes | Yes | Path to the toolset's location in the hierarchy of the Public folders. Use **Move to** to change the application's location. |
| **External Endpoint** | Yes | Yes | Endpoint DIAL Core will use to communicate with the related MCP server. |
| **Transport** | Yes | Yes | Transport supported by MCP server.<br />- **HTTP** (default)<br />- **SSE** (deprecated) |
| **Authentication** | Yes | Yes | [Authentication settings for the toolset.](#authentication) |
| **Forward per request key** | Yes | Yes | Set this flag to `true` if you want a [per-request key](/docs/platform/3.core/3.per-request-keys.md) to be forwarded to the toolset endpoint allowing a toolset to access files in the DIAL storage. **Note**: it is not allowed to create toolsets with `authType.API_KEY` and `forwardPerRequestKey=true`. |
| **Max retry attempts** | Yes | Yes | Number of times DIAL Core will [retry](/docs/platform/3.core/5.load-balancer.md#fallbacks) a failed call (due to timeouts or 5xx errors). |

#### Authentication

If the toolset you have chosen requires authentication at the related MCP server, you will have to sign in before you can use it. For example, if you are using an application that relies on the MCP toolset and authentication is required, you will not be able to access it unless you are logged in. Therefore, make sure you are authenticated with MCP server you are about to use.

**Note**, that toolset can be published with credentials by other users. In this case, a toolset can be already authenticated for all users in the organization - **Logged in (Organization)**. You can use it or log out and log back in with your personal credentials - **Logged in (Personal)**.

> Refer to [DIAL Core](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/toolset_credentials_api.md) to learn more about toolset authentication

##### Step 1: Select and configure the authentication method 

DIAL supports several authentication methods for toolsets:

* **OAuth**: Authenticate via OAuth 2.0 with an external identity provider. If this option is selected, you have to choose **With login** for a dynamic registration of clients or **With login & configuration** for a static registration of clients - depending on what method your MCP server supports. For a dynamic option, it is enough to provide an **External Endpoint** in the toolset properties. For a static, populate the authentication form with correct values provided by the identity provider:
    - **Redirect URI**: Redirect URI used during sign in flows. After authentication, the MCP Server redirects the User to the provided URI.
    - **Client ID**: Unique identifier of the client/application requesting access to the resource. 
    - **Client Secret**: Confidential key used by a client to authenticate itself with the authentication server. 
    - **Scopes Supported**: List of supported scopes that define access levels. May be discovered via .well-known endpoints. 
    - **Default authorization endpoint**: URL for performing authorization. Can be discovered via .well-known metadata if provided by the Authorization Server.
    - **Default token endpoint**: URL where a client exchanges authorization code for an access token. Can be discovered via .well-known metadata if provided by the Authorization Server.
    - **PKCE method**: Proof Key method for Code Exchange (PKCE), usually `plain` or `S256`.
* **API Key**: Authenticate using API key. If this option is selected, provide API key and header name in the configuration.
* **Without authentication**: No authentication is required.

![](img/assets_toolsets_auth.png)

##### Step 2: Choose personal or organization authentication

Having selected and configured any authentication method, click **Save** and **Log In** to authenticate a toolset with the related MCP server. At this step, prior to the actual authentication, you will be prompted to select between **Personal** and **Organization** authentication:

* **Personal**: the toolset will be authenticated for your user only with the authentication state labeled **Logged in (Personal)**.
* **Organization**: the toolset will be authenticated for all users in your organization with the authentication state labeled **Logged in (Organization)**. Any user will be able to log out and log back in with personal credentials.

**Important**: at this step, for authentication with API keys, you will be prompted to provide a valid API key value.

![](img/assets_toolsets_auth2.png)

### Tools Overview

[Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) are functions supported by an MCP server that can be used by clients to perform specific actions. On this screen, you can find and manage all tools supported by the related MCP server.

In case your toolset was created based on the MCP container deployed in DIAL, the content of this screen is inherited from the related [MCP container](/docs/tutorials/3.admin/deployments-mcp.md#tools-overview) and displays all the **enabled** tools. Click [Manage tools](#manage-tools) to access, try and enable all the available tools.

#### Use all tools

Enable **Use all available tools** toggle to automatically include all tools supported by the related MCP server. When enabled, you cannot add or remove tools manually.

Click on any tool to preview its details or [try it out](#try-tools).

![](img/assets_tools_tools_overview.png)

#### Manage tools

Disable **Use all available tools** toggle to enable a manual tools management mode.

![](img/assets_manage_tools.png)

1. Disable **Use all available tools** toggle and click **Manage tool** button to open the **Manage tools** modal.
2. The modal displays all tools available to your user. You can preview and enable/disable each tool individually.
3. MCP sever can support other tools that are not available to your user and therefore are not rendered in the list of available tools. If you know their names, you can manually add them. Manually-added tools are labeled accordingly on the Tools Overview screen.
4. Click **Confirm** to apply changes.
5. On the **Tools overview** screen, use the filter to see all tools, just auto-detected tools or manually added tools.
6. Hover over any tool to see its details or [try it out](#try-tools).

![](img/assets_toolsets_manage_tools.png)

#### Try tools

Click or hover over any **enabled** tool and click **Try out** to enter the Try out mode.

In the **Try out mode**, you can test each enabled tool by sending a request to the server. When sending a request, you can use the rendered UI form to populate the request input fields or enter JSON view mode to get access to all the fields supported by the input schema.

##### To try tool

1. Click any available tool to access its description and input schema parameters. You can display input schema in both table and JSON view modes.
2. Click **Try out** to open a side bar for sending requests.
3. Populate the Request body. You can display request body in both table and JSON view modes.  
4. Click **Send Request** to send the request. The response from the server will be displayed in the Response body area.

![](img/assets_toolset_tryout.png)

### JSON Editor

**Advanced users with technical expertise** can work with the toolset properties in a JSON editor view mode.

Use the **JSON Editor** toggle to switch between the form-based UI and raw JSON view of the toolset’s configuration. It is useful for advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed on UI.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

![ ](img/assets_toolsets_json.png)

##### Switching to the JSON Editor

1. Navigate to **Assets → Toolsets**, then select the toolset you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.
