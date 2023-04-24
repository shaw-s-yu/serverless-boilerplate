import tracer from './tracer'
import { LOG } from 'dd-trace/ext/formats'
import { createLogger, format, transports } from 'winston'

class Logger {
  log(level: string, message: string): void {
    if (process.env.ENV === 'development') {
      this.logLocal(level, message)
    } else {
      this.logToDataDog(level, message)
    }
  }

  logLocal(level: string, message: string): void {
    const logger = createLogger({
      level: 'info',
      exitOnError: false,
      format: format.json(),
      transports: [
        new transports.File({
          filename: process.env.d,
        }),
      ],
    })
    logger.log(level, message)
  }

  logToDataDog(level: string, message: string): void {
    const span = tracer.scope().active()
    const time = new Date().toISOString()
    const record = { time, level, message }

    if (span) {
      tracer.inject(span.context(), LOG, record)
    }

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(record))
  }
}

export default Logger
