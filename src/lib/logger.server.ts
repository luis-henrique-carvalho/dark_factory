import '@tanstack/react-start/server-only'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown> & {
  scope?: string
}

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

function normalizeContext(context: LogContext): LogContext {
  const normalized = normalizeValue(context)
  return normalized && typeof normalized === 'object' && !Array.isArray(normalized)
    ? (normalized as LogContext)
    : {}
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return /\s/.test(value) ? JSON.stringify(value) : value
  }

  return JSON.stringify(value)
}

function formatContext(context: LogContext): string {
  const entries = Object.entries(context).filter(
    ([, value]) => value !== undefined,
  )

  if (entries.length === 0) return ''

  return ` ${entries
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(' ')}`
}

function write(level: LogLevel, message: string, context: LogContext = {}) {
  const normalizedContext = normalizeContext(context)
  const { scope = 'Dark Factory', ...restContext } = normalizedContext
  const timestamp = new Date().toISOString()

  console[level](
    `${timestamp} ${level.toUpperCase()} [${scope}]: ${message}${formatContext(
      restContext,
    )}`,
  )
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
  log: (level: LogLevel, message: string, context?: LogContext) => {
    write(level, message, context)
  },
}
