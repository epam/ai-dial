# Compliance and Legal Q&A

> **This document is intended for self-hosted enterprise editions of DIAL.**

## Data Usage and Processing

##### How is data transmitted to the DIAL Platform utilized? Is such data incorporated into model training datasets?

The DIAL Platform retains conversational data and prompts in system logs exclusively for governance and compliance purposes. When interfacing with third-party cloud-based Large Language Models (including but not limited to Azure OpenAI, Google Vertex, AWS Bedrock), the platform utilizes your organization's designated cloud AI subscriptions. The processing, retention, and utilization of such data by these third-party providers is governed by the applicable service agreements executed between your organization and the respective cloud service provider.

##### Where are conversation logs maintained and what security protocols are implemented?

The DIAL Platform stores all log data within object storage solutions (Azure Blob Storage, Google Cloud Storage, Amazon S3) provisioned within your organization's cloud infrastructure. Access controls and security configurations for such storage repositories remain under the exclusive administration of your organization's IT department.

## Technical Limitations and Safety

##### What are the known technical limitations of the DIAL Platform, such as potential for hallucinations?

The DIAL Platform functions solely as an orchestration layer for Large Language Models and does not incorporate generative AI logic internally. Any limitations such as hallucinations or factual inaccuracies are inherent to the specific LLMs or applications being orchestrated rather than the platform itself.

##### What safety testing protocols have been implemented for the DIAL Platform regarding potentially harmful or malicious queries?

As an orchestration layer, the DIAL Platform does not independently evaluate content or implement content-based restrictions. Responsible AI metrics, content filtering, and safety measures are functionalities of the specific LLMs or applications being orchestrated, not the platform itself.

## Regulatory Compliance

##### How does the DIAL Platform ensure compliance with data privacy regulations (e.g., GDPR) regarding the collection, processing, and storage of personal data?

While specific compliance implementation remains the responsibility of the deploying organization, the DIAL Platform implements several compliance-oriented features:

1.	Configurable option to disable collection of conversation logs
2.	Configurable data retention policies on cloud data storage level that can automatically purge conversation logs and sensitive files after a predetermined interval (e.g., 30 days)
3.	An Interceptor framework that examines communications bidirectionally (both user prompts and LLM responses)
4.	Capability to implement custom validation logic for detecting and handling sensitive information or personally identifiable information (PII)
5.	Options to modify or block requests containing prohibited content

These capabilities help to minimize and control lifetime of PII within DIAL, helping to build it into organization’s ecosystem, compliant with data privacy regulations.

##### How will the DIAL Platform comply with the EU AI Act concerning general-purpose AI systems?

While specific compliance implementation remains the responsibility of the deploying organization, the DIAL Platform provides technical capabilities that facilitate compliance with the EU AI Act, including:
1.	Comprehensive conversation logging for audit and investigative purposes
2.	Transparent AI-generated content labeling mechanisms
3.	User feedback collection functionality for quality assessment and improvement
Collected conversations and feedback help deploying organization to perform analysis and make corrections to how DIAL is used and add necessary guardrails to ensure compliance.

## Security and Data Protection

##### What security measures protect sensitive or confidential information processed through the DIAL Platform?

The DIAL Platform incorporates a multi-layered security architecture including:
1.	In-transit and at-rest protection of sensitive information, using TLS protocol for all exposed connections and built-in encryption mechanisms of cloud storage services.
2.	Attack surface minimization through reverse proxy implementation and API management
3.	Network isolation of cloud resources via firewalls and private connectivity
4.	Mandatory token-based authentication utilizing JWT standards
5.	Integration with OpenID Connect-compliant Identity Providers
6.	Centralized role-based access control (RBAC) with granular permission management
7.	Group-based access controls for precise resource authorization

## Intellectual Property and Liability

##### Who retains intellectual property rights to content generated via the DIAL Platform, and how are copyright matters addressed?

The DIAL Platform functions exclusively as an intermediary orchestration layer and does not independently generate or modify AI content. Consequently, intellectual property rights and copyright ownership for any generated content are governed by the terms and conditions established in the service agreements between your organization and the respective LLM provider (Azure OpenAI, Google Vertex, AWS Bedrock, etc.).

##### How does the system address concerns regarding potential bias in AI-generated content, particularly when processing sensitive or regulated data? Who bears liability for inaccurate or inappropriate AI-generated content?

The DIAL Platform operates solely as an orchestration layer for third-party LLM models and does not independently generate content. Liability considerations regarding content accuracy, appropriateness, and potential bias are determined by the contractual arrangements between your organization and the respective LLM service provider as specified in the applicable service agreements.

##### What degree of human oversight is required for monitoring AI-generated content, and what policies govern the review or override of DIAL Platform outputs?

The requisite level of human oversight is contingent upon the criticality, sensitivity, and regulatory context of the content being generated. Policies governing content review, approval workflows, and override mechanisms are typically established by the implementing organization. Clients are advised to develop and implement comprehensive governance frameworks aligned with their specific operational requirements, risk tolerance, and applicable regulatory obligations.
