# Launch AI DIAL Chat with Echo Application

## About AI DIAL Extension Framework

AI DIAL presents a robust Extension Framework and plug-in infrastructure, enabling seamless integration of your data and business workflows with Language Models (LLM) to enrich your enterprise applications. Harness the full potential of our solutions to drive innovation and efficiency within your organization.

> Refer to the [AI DIAL website](https://epam-rail.com/extension-framework) to learn more.

## About AI DIAL Applications 

In the AI DIAL framework, **Applications** refer to predefined configurations of Addons and other services, or any other custom logic packaged as a ready-to-use solution.

Applications enable the customization of LLM behavior by integrating Addons with any desired logic. It can be any component that conforms to DIAL API requirements. Applications can be used for implementing non-LLM related logic, such as repeating user messages, a fully deterministic chatbot, or even a complex multi-LLM interaction. This versatility in Applications allows for tailored handling of unique scenarios and requirements.

Examples of Applications: guided conversations, hierarchical search.

## Introduction

From this tutorial, you will learn how to create and deploy a simple Echo application for AI DIAL Chat. Echo application mirrors all user prompts.

> Take note that this document covers the most basic aspects of developing and testing AI DIAL applications. Deploying and distributing these applications for production purposes will require additional configurations that guarantee secure access to the application endpoints through the implementation of firewalls and other network security settings to prevent unauthorized intrusion to the deployed applications.

## Prerequisites

1. Docker engine installed on your machine.
2. [Python 3.8](https://www.python.org) or higher installed on your machine.
3. [pip](https://pip.pypa.io/en/stable/) for Python installed.
4. IDE for the Python development. [VS Code](https://code.visualstudio.com) or [PyCharm](https://www.jetbrains.com/pycharm/) are recommended.
5. IDE is configured to use the PEP-8 compatible formatting (i.e. [Black](https://black.readthedocs.io/en/stable/index.html)).

## Step 1: Get Docker Compose

[Download](https://github.com/epam/ai-dial/tree/main/docs/dial-docker-compose/application/) AI DIAL Docker Compose.

## Step 2: Create a Echo Application

Create a python file in your project folder and name it `app.py`.

> Refer to the [application file](./dial-docker-compose/application/echo/app.py). 

We use a [dockerfile](https://github.com/epam/ai-dial/tree/main/docs/dial-docker-compose/application/echo) to launch the Echo application.

## Step 3: Configuration

1. Your AI DIAL installation has a `core/config.json` file. Open it and add the following lines in the [applications](https://github.com/epam/ai-dial/tree/main/docs/dial-docker-compose/application/core/config.json#L11) section:

    ```json
    "echo": {
        "displayName": "My Echo App",
        "description": "Simple application that repeats user's message",
        "endpoint": "http://echo:5000/openai/deployments/echo/chat/completions",
        "iconUrl": "Url to your app icon (SVG) like this one https://www.svgrepo.com/show/532030/circle-heat.svg"
    }
    ```

2. Add your Echo app to the roles you want it to be exposed to. For example, to add it to the `default` role, add the following lines in the [roles](https://github.com/epam/ai-dial/tree/main/docs/dial-docker-compose/application/core/config.json#L47) section:

    ```json
    "default": {
        "limits": {
            "echo": {}
        }
    }
    ```

## Step 4: Launch AI DIAL Chat with Echo Application

Run `docker compose up` in the console from the folder with the `docker-compose.yml` file.

Once AI DIAL Chat is up on http://localhost:3000/, select the Echo Application and start typing in prompts to see how the Echo application mirrors them.


