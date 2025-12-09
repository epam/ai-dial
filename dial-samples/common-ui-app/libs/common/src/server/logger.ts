import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  messageFormat: '{msg} [trace_id={trace_id}, span_id={span_id}]',
  translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
});

export const logger = pino(stream);

export const logError = (error: unknown, context: Record<string, unknown>, message: string) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : 'No stack trace available';

  logger.error(
    {
      error: {
        message: errorMessage,
        stack: errorStack,
      },
      ...context,
    },
    message,
  );
};
