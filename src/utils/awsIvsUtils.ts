import * as AWS from 'aws-sdk'
import { isEmpty } from './helpers'

AWS.config.update({ region: process.env.AWS_REGION })
export const ivs = new AWS.IVS()

export async function createChannel(params: AWS.IVS.CreateChannelRequest): Promise<AWS.IVS.CreateChannelResponse> {
  return new Promise((resolve, reject) => {
    ivs.createChannel(params, (err, data) => {
      if (!isEmpty(err)) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function deleteChannel(params: AWS.IVS.DeleteChannelRequest): Promise<object> {
  return new Promise((resolve, reject) => {
    ivs.deleteChannel(params, (err, data) => {
      if (!isEmpty(err)) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function stopStream(params: AWS.IVS.StopStreamRequest): Promise<AWS.IVS.StopStreamResponse> {
  return new Promise((resolve, reject) => {
    ivs.stopStream(params, (err, data) => {
      if (!isEmpty(err)) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function getStream(params: AWS.IVS.GetStreamSessionRequest): Promise<AWS.IVS.GetStreamSessionResponse> {
  return new Promise((resolve, reject) => {
    ivs.getStreamSession(params, (err, data) => {
      if (!isEmpty(err)) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
