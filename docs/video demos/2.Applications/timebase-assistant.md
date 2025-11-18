# TimeBase AI Assistant

https://youtu.be/fqFx4vXbjLM

This case study demonstrates how DIAL multi-agent applications with natural language interface can retrieve, analyze, transform, and monitor financial data in real-time.

In this example, we created a multi-agent AI assistant for [TimeBase](https://timebase.info/) - a time-series database created by [Deltix](https://www.deltixlab.com/). The assistant is used to monitor SPY ticker prices, generate technical indicators, and create trading signals with real-time alerts. At every step, users can see the agents' reasoning and the code generated to complete each task.

Key highlights:

- Data Retrieval: The agent generates Python code to fetch historical SPY prices from TimeBase and displays them on chart.
- Technical Indicators: The agent calculates and adds Bollinger Bands and RSI (Relative Strength Index) indicators to the chart.
- Trading Signals: The agent marks buy and sell signals on the chart based on the trade logic provided by the user in natural language.
- Real-Time Monitoring: The agent sets up a real-time TimeBase monitor in DIAL, applies the trading rules, and sends alerts to the user through the chosen communication channel.
