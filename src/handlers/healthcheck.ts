import { APIGatewayProxyResult } from 'aws-lambda'
import tracer from '../utils/tracer'
import Logger from '../utils/logger'

export async function handler(): Promise<APIGatewayProxyResult> {
  try {
    //this sends a trace to datadog cloud
    const span = tracer.startSpan('forte-live-class-scheduler-healthcheck')
    span.setTag('healthcheck', 'OK')
    span.finish()

    // this sends a log to local datadog-agent or datadog cloud
    new Logger().log('info', 'heathcheck')

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'OK',
      }),
    }
  } catch (err: unknown) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'some error happened',
      }),
    }
  }
}
