# Prompt Publications

## What Are “Prompt Publications” in DIAL?

Prompt Publications are user-initiated requests from the DIAL chat interface to add a newly crafted prompt into the central Assets → Prompts library. 
They let administrators decline or approve users-submitted prompts to become part of the shared organization-wide toolkit.

Related DIAL Core documentation on Prompt Publications:

* https://docs.dialx.ai/video%20demos/Chat/dial-publications

## Prompt Publications Listing

The Prompt Publications screen shows all prompts that end-users have submitted for publication from the DIAL chat interface. 

![img.png](img/img_52.png)

### 1. Navigate to Prompt Publications

In the sidebar, expand **Approvals** and click **Prompt Publications**.

### 2. Prompt Publications Grid

**Columns are**:

| Column         | Definition                                                                                                                        |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Name**       | The user-friendly name of the prompt submitted for publication.                                                                  |
| **Author**     | The username of the one that submitted the prompt.                                                                                |
| **Created at** | Timestamp when the prompt was submitted for publication. Sorted ascending/descending to find newest or oldest submissions easily. |

**Filtering & Sorting**
* Each column header has sort arrows; click to reorder.
* Beneath each header is a filter box - type text to narrow the list in real time.

Clicking on any row to review the respective prompt publication request.

## Prompt Publication - Review Page

The Prompt Publications – Review page lets administrators inspect a user-submitted prompt from the DIAL Core chat interface and decide whether to Publish it into the shared Assets → Prompts library or Decline it back to the author (with feedback).

![img_1.png](img/img_53.png)

### Top Bar Controls

* **Publish**: Accept the submission. This adds the prompt into the Assets → Prompts folder (under the specified Folder).
* **Decline**: Reject the submission. Prompts you to enter a decline reason that will be sent back to the author for revision.

### Fields

| Element                | Definition                                                                        |
|------------------------|-----------------------------------------------------------------------------------|
| **Action**             | Suggested action. Is **Publish** when pending review).                            |
| **Author**             | Username of the account that created the prompt publication request in DIAL Core. |
| **Created At**         | Timestamp of when the prompt was submitted for review.                            |
| **Folder Storage**     | Default target folder under **Assets → Prompts** if published.                    |
| **Prompt Identifier**  | Header showing the prompt’s **name**.                                             |
| **Version**            | Version string assigned by the author.                                            |
| **Description**        | Optional user-friendly summary provided by the author.                           |
| **Content**            | The actual prompt string that will be executed in chats after publishing.         |
| **Permissions**        | Shows the target folder's place in folders hierarchy and respective permissions.  |
