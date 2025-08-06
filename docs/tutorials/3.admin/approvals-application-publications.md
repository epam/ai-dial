# Application Publications

## About Application Publications

DIAL offers [API](https://dialx.ai/dial_api#tag/Publications/operation/createPublication) for creating publication requests for resources, including applications.

Application Publications is where admins review and act on publish requests that creators submit from the DIAL chat side. 
Each request includes all configuration details, so admin can validate and assess it before app is available on the organization level.

> * Refer to [Publications](/docs/platform/7.collaboration-intro.md#publication) to learn more about publications in DIAL.
> * Refer to [Publications](/docs/tutorials/0.user-guide.md#publications) in Chat user guide to learn more about end-to-end flow.


## Application Publications List

The Application Publications screen shows all apps that end-users have submitted for publication using the DIAL API. 

![ ](img/93.png)

##### Application Publications Grid

| Field            | Definition                                                                                                                      |
|------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Name**         | The title of the submitted publication request (not the application).                                                           |
| **Author**       | The user who has submitted the publication request. Can be used to follow up with the creator if something needs clarification. |
| **Created at**   | Submission's timestamp.                                                                                                         |


## Application Publication Review Page

In the Application Publications Review page, you can inspect application publication request and decide whether to **Publish** it to marketplace or **Decline** it.

##### Top Bar

* **Publish**: Accept the publication request. This adds the application into the [DIAL Marketplace](/docs/tutorials/0.user-guide.md#dial-marketplace-home-page) on the chat side.
* **Decline**: Reject the publication request. Prompts you to enter a decline reason that will be sent back to the publication request author.

| Field               | Definition                                                                                                                                           |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Runner**          | The application runner that is used by this app (shown as a URL).                                                                                    |
| **Author**          | Username of the account that created the app publication request.                                                                                    |
| **Create Time**     | Timestamp of when the app publication request was submitted for review.                                                                              |
| **Folder Storage**  | The destination folder path where the app assets stored if published under [Assets → Files](/docs/tutorials/3.admin/assets-files.md), if published.  |

![](img/94.png)


## Properties Tab

| Field            | Definition                                                                                                                                                               |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Name**         | End-user application name to be shown in [DIAL Marketplace](/docs/tutorials/0.user-guide.md#dial-marketplace-home-page). It must be clear and policy-safe.               |
| **Version**      | Semantic version of this submission (e.g., `0.0.1`) set on the DIAL chat side.                                                                                           |
| **Description**  | Summary of app's purpose and capabilities specified by the submitting user. Helps assess app's fit and scope.                                                            |
| **Icon**         | Application's visual icon that users will see in [DIAL Marketplace](/docs/tutorials/0.user-guide.md#dial-marketplace-home-page) once the app is published.               |
| **Topics**       | Tags/categories (e.g., “Text Generation”, “Informational”) used for the app discovery in [DIAL Marketplace](/docs/tutorials/0.user-guide.md#dial-marketplace-home-page). |
| **Permissions**  | The proposed access rules to the application (e.g., based on user group). Ensure the audience matches intended reach.                                                    |

**Controls:**
* **Review structure** opens a modal showing the storage folders tree and apps' folder position in the hierarchy.
* **Compare changes** side-by-side diff of **current vs proposed** permission rules to the app's folder. Use before publishing to confirm exactly what will change.

![](img/95.png)

## Parameters Tab

The Parameters tab within the Application Publications detail view provides administrators with technical metadata and runtime configuration related to the application. 

The content of this tab may vary depending on the app's type and configuration.

## Prompts Tab

The Prompts tab under the Application Publications section allows administrators to view and assess the prompts related to the published application. 

The tab is optional and present only if at least one prompt exists in the application being published.

| Field               | Definition                                                                                      |
|---------------------|-------------------------------------------------------------------------------------------------|
| **Prompt name**     | Identifier for the prompt.                                                                      |
| **Version**         | Version of the prompt.                                                                          |
| **Description**     | Summary of what the prompt is meant to do.                                                      |
| **Prompt content**  | The instruction text. Use **View more** to expand and inspect full content in the modal window. |


## Files Tab

The Files tab under Application Publications displays a list of application-related files. 

The files are optional and if no app-related files exist, it is blank.

| Field         | Definition                                                                  |
|---------------|-----------------------------------------------------------------------------|
| **Name**      | Stored filename or generated identifier of the application's bundled asset. |
| **Extension** | File type (e.g., `.json`, `.png`).                                          |
| **Preview**   | In row action menu allows to open the file in a new tab.                    |
| **Download**  | In row action menu allows to download the file to a local PC.               |

![](img/96.png)
