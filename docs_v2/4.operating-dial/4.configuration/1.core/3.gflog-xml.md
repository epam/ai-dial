---
title: "gflog.xml"
type: reference
persona: devops
component: core
last_verified: 2026-04-29
owner: "@dial-core-team"
---

# gflog.xml

`gflog.xml` configures the [gflog](https://github.com/epam/gflog) logging framework used by DIAL Core. It controls log output destinations, rotation, and verbosity.

## File location

The configuration file is passed via the `JAVA_OPTS` environment variable and mounted as a volume in Docker Compose:

```yaml
core:
  environment:
    'JAVA_OPTS': '-Dgflog.config=/opt/settings/gflog.xml'
    'LOG_DIR': '/app/log'
  volumes:
    - ./settings:/opt/settings
    - ./core-logs:/app/log
```

## Default configuration

From [`dial-docker-compose/settings/gflog.xml`](https://github.com/epam/ai-dial/blob/main/dial-docker-compose/settings/gflog.xml):

```xml
<config>
    <appender name="console" factory="com.epam.deltix.gflog.core.appender.ConsoleAppenderFactory"/>
    <appender name="file" factory="com.epam.deltix.gflog.core.appender.DailyRollingFileAppenderFactory"
              bufferCapacity="32m"
              file="/app/log/aidial.log"
              maxFiles="10"
              maxFileSize="1g">
        <layout template="%m%n"/>
    </appender>

    <logger level="INFO">
        <appender-ref ref="console"/>
    </logger>

    <logger level="INFO" name="aidial.log">
        <appender-ref ref="file"/>
    </logger>

    <service entryEncoding="UTF-8" entryMaxCapacity="30m" bufferCapacity="128m"/>
</config>
```

## Appender reference

| Appender | Type | Description |
|---|---|---|
| `console` | `ConsoleAppenderFactory` | Writes log entries to standard output. |
| `file` | `DailyRollingFileAppenderFactory` | Writes to a daily rolling file. Rotates daily, retaining up to `maxFiles` files of up to `maxFileSize` each. |

## File appender settings

| Attribute | Default | Description |
|---|---|---|
| `file` | — | Log file path. |
| `maxFiles` | `10` | Number of rotated log files to retain. |
| `maxFileSize` | `1g` | Maximum size per log file before rotation. |
| `bufferCapacity` | `32m` | In-memory buffer size for the file appender. |

## Service settings

| Attribute | Default | Description |
|---|---|---|
| `entryEncoding` | `UTF-8` | Character encoding for log entries. |
| `entryMaxCapacity` | `30m` | Maximum size of a single log entry. |
| `bufferCapacity` | `128m` | Global logging service buffer size. |

## Customization

To increase log verbosity for debugging, change the logger level:

```xml
<logger level="DEBUG">
    <appender-ref ref="console"/>
</logger>
```

To disable file logging entirely, remove the `file` appender and its logger reference.

## Next steps

- [settings.json](settings-json/index) — static settings reference
- [config.json](config-json/index) — dynamic settings reference
