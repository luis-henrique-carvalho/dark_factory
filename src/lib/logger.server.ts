import '@tanstack/react-start/server-only'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>

const sensitiveKeyPattern =
  /authorization|cookie|password|token|secret|session|api[-_]?key/i

function normalizeValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: process.env.NODE_ENV === 'development' ? value.stack : undefined,
    }
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sensitiveKeyPattern.test(key)
          ? '[REDACTED]'
          : normalizeValue(nestedValue),
      ]),
    )
  }

  return value
}

function write(level: LogLevel, message: string, context: LogContext = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: 'dark_factory',
    environment: process.env.NODE_ENV ?? 'development',
    ...normalizeValue(context),
  }

  if (process.env.NODE_ENV === 'development') {
    console[level](message, payload)
    return
  }

  console.log(JSON.stringify(payload))
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    write('debug', message, context),
  info: (message: string, context?: LogContext) =>
    write('info', message, context),
  warn: (message: string, context?: LogContext) =>
    write('warn', message, context),
  error: (message: string, context?: LogContext) =>
    write('error', message, context),
}
