# Handling High Loads in AI DIAL

In this document, we provide the highlights of the results of testing we conducted to measure the latency, throughput and errors count in AI DIAL under various scenarios, especially under high loads, involving many completions and prompts. 

## Preconditions

We ran a series of tests involving various scenarios: small prompt to small completion, small prompt to large completion, large prompt to small completion, and large prompt to large completion. 
Also, AI DIAL setup with multiple endpoints was compared to a single-endpoint OpenAI setup to demonstrate the advantages of the load balancing contrary to using single-endpoint setups. 

## Response Speed

When testing the average response time, AI DIAL has proven to deliver better results compared to single OpenAI instances.

**Few tokens**: completion=1, prompt=30, total=31

|	|Model|Endpoints count|Load	|Avg response time, ms|
|--|--|--|--|--|
|Dial Core|	gpt-35-turbo-16k|	9	|10 requests per sec|	542|
|OpenAI|	gpt-35-turbo-16k|	1	|10 requests per sec|	799|

When we conducted the same tests under heavier loads, the results clearly demonstrated that AI DIAL performed better, further showcasing its effectiveness.

**Many tokens**: completion=2189, prompt=2204, total=4393

|	|Model|Endpoints count|Load	|Avg response time, ms|
|--|--|--|--|--|
|Dial Core|	gpt-4-0613|	6|	0.5 requests per sec|	121350|
|OpenAI|	gpt-4-0613|	1|	0.5 requests per sec|	177370|

## Errors Rate

We also ran tests to measure the number of successful completions and the occurrence of errors, specifically HTTP 429 (Too Many Requests). These tests showed that users are far less likely to get an error in the response when using AI DIAL.

**Errors reports**: tokens: completion=473, prompt=31, total=504

|	|Model|Endpoints count|Load	|	Errors|
|--|--|--|--|--|
|Dial Core|	gpt-35-turbo-1106|	5|	3 requests per sec|	0|
|OpenAI|	gpt-35-turbo-1106|	1|	3 requests per sec|	1%|

**Errors reports**: tokens: completion=2189, prompt=2204, total=4393

|	|Model|Endpoints count|Load	|	Errors|
|--|--|--|--|--|
|Dial Core|	gpt-4-1106-preview|	3|	1 request per sec|	0|
|OpenAI|	gpt-4-1106-preview|	1	|1 request per sec	|57%|

## Findings

### Efficient Distribution of Quota

AI DIAL allows you to split Azure OpenAI service quotas, which can be allocated to a single deployment or divided among multiple deployments. This feature enables controlled RPM (Requests Per Minute) or TPM (Tokens Per Minute) for applications, optimizing resource allocation and maximizing quota usage.

### Load Balancing

AI DIAL's load balancer efficiently spreads requests across several deployments, ensuring that no single deployment becomes overwhelmed. This strategy guarantees consistent performance and avoids bottlenecks, especially during times of peak demand. In our tests, AI DIAL reliably delivers faster average response times and handles more requests per second. While single instances often suffer from rapidly declining requests and unpredictable response times under heavy loads, AI DIAL sustains a steady and reliable performance level.

### Fewer Errors and Retry Mechanism

AI DIAL's multiple-deployment strategy significantly reduces the likelihood of encountering errors, a common issue with single OpenAI instances during periods of high demand. Additionally, AI DIAL's ability to automatically retry failed requests boosts overall reliability, ensuring the consistent performance and better user experience.
