# Introduction to DIAL Admin Panel

## About

The DIAL Admin Panel provides system [administrators](#who-is-admin) a feature-rich, intuitive, and customizable UI to configure, manage, and monitor the DIAL ecosystem. 

> Admin Panel serves as a powerful UI for administrators. System configurations can be done also by a direct modification of a [DIAL Core config](https://github.com/epam/ai-dial-core).

> Watch a [video demo](/docs/video%20demos/4.dial-admin-panel.md).

## GitHub Repositories

Admin Panel is licensed under the Apache License 2.0. 

It is developed in two separate repositories for frontend and backend components:

* [Frontend](https://github.com/epam/ai-dial-admin-frontend)
* [Backend](https://github.com/epam/ai-dial-admin-backend)
* [Deployment Manager Backend](https://github.com/epam/ai-dial-admin-deployment-manager-backend): Additional module provides interface for managing container image builds, deployments, and lifecycle operations for AI workloads.

Current Focus:  
  
## Who is Admin

System admin(s) can be defined in [DIAL Core static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) in the `access.admin.rules`. Admin has the following privileges:

* Has `READ` and `WRITE` access to all public system resources (conversations, prompt, files, toolsets and applications).
* Can view, approve and reject publication requests from DIAL users. 
* Has access to all DIAL Core API endpoints, provided corresponding permissions are in place.
* Can modify DIAL Core config via Admin Panel to manage AI models, applications, application runners, API keys, interceptors and more. 

> Refer to [Access Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about access control in DIAL and the role of a system administrator.