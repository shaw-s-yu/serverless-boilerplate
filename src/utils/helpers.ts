import { APIGatewayProxyEvent } from 'aws-lambda'

export function isEmpty(object: unknown): boolean {
  if (object === null || object === undefined) {
    return true
  }
  if (!(object instanceof Array)) {
    return true
  }
  return object.length === 0
}

export function extractRequestBody(
  event: APIGatewayProxyEvent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return JSON.parse(event?.body ?? JSON.stringify(event))
}

export function convertDateToUnixTime(date: Date | null): number {
  if (date === null || date === undefined) {
    return null
  }
  return Math.floor(date.getTime() / 1000)
}
