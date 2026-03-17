# Prompt Publications

DIAL users can publish their private prompts to enable access to other users. Each publication request undergoes a review by DIAL administrators to ensure safety and security.

> You can access published prompts in [Assets/Prompts](/docs/tutorials/3.admin/assets-prompts.md) section.

In this section of the DIAL Admin panel, admins can access and approve or decline requests to publish prompts.

> * Refer to [Publications](/docs/platform/7.collaboration-intro.md#publication) to learn more about publications in DIAL.
> * Refer to [DIAL Chat User Guide](/docs/tutorials/0.user-guide.md#publications) to learn about the publication process from the perspective of a DIAL Chat end-user.
> * Refer to [Publication API](https://dialx.ai/dial_api#tag/Publications) for programmatic creation and management of publication requests.

## Main Screen

The Prompt Publications screen shows all publish/unpublish requests submitted by end-users using the [Publication API](https://dialx.ai/dial_api#tag/Publications). 

![ ](img/img_52.png)

##### Prompts publications grid

| Column | Description |
|--------|--------------|
| **Name** | Title of the submitted publication request. |
| **Author** | The user who has submitted the publication request. |
| **Creation time** | Publication request submission's timestamp. |

## Review Publication Request

Click any request on the main screen to access the review page. On this page, you can inspect the selected request and decide whether to **Publish**, **Unpublish** or **Decline** it.

##### Top Bar Controls

* **Publish**: Applies to publish requests. Use to approve the request.
* **Unpublish**: Applies to unpublish requests. Use to approve the request and remove the published toolset from the public folder and make it inaccessible to other users.
* **Decline**: Reject the publish/unpublish request. Prompts you to enter a decline reason that will be sent back to the request author.
* **Delete**: Deletes the request.

![](img/publication-actions.png)

![](img/publication-actions-unpublish.png)

### Properties

| Field | Description |
|---------|------------|
| **Author** | Username of the account that created the prompt publication request. |
| **Creation Time** | Timestamp of when the prompt publication request was submitted for review. |
| **Folder Storage** | The default target folder under [Assets → Prompts](/docs/tutorials/3.admin/assets-prompts.md), if published. |
| **Prompt Identifier** | Header showing the prompt's **name**. |
| **Version** | Version string assigned by the author. |
| **Description** | Optional user-friendly summary provided by the author. |
| **Content** | The actual prompt string. |
| **Permissions** | The proposed access rules to the published prompt (e.g., based on user group). Ensure the audience matches intended reach. If rules are not defined, the published resources will be available to all users.<br />**Available Controls:**<br />• **Review structure** - opens a modal showing the storage folders tree and prompt's folder position in the hierarchy.<br />• **Compare changes** - side-by-side diff of **current vs proposed** permission rules to the prompt's folder. Use to verify and validate changes in access rules before approving the publication request. |

![](img/prompt-publication-properties.png)

### Permissions

![](img/prompt-publication-permissions.png)