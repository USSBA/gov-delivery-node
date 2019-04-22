'use strict'

const { jsonToXml, request, xmlToJson } = require('../util')

const ø = Object.create(null)

module.exports = {
  add: addOrDelete.bind(ø, 'post'),
  delete: addOrDelete.bind(ø, 'delete')
}

async function addOrDelete (method, {
  countryCode,
  email,
  phone,
  sendNotifications = false,
  topics = [],

  // TODO: Dynamically inject this option
  raw = false
} = {}, requestSettings) {
  if (email && (phone || countryCode)) {
    throw Error('Provide one of email or phone and country code')
  }

  // the field with the subscriber's email or phone number (and optional
  // country code)
  let field

  if (email) {
    field = {
      email: { _text: email }
    }
  } else if (phone) {
    field = {
      phone: { _text: phone },
      ...(countryCode && { 'country-code': { _text: countryCode } })
    }
  }

  const data = jsonToXml({
    subscriber: {
      ...field,

      'send-notifications': {
        _attributes: {
          type: 'boolean',
        },
        _text: sendNotifications
      },
      topics: {
        _attributes: {
          type: 'array'
        },
        topic: topics.map(topic => ({
          code: {
            _text: topic
          }
        }))
      }
    }
  })

  const responseData = await request({
    ...requestSettings,
    data,
    method,
    url: '/subscriptions'
  })

  if (raw) {
    return responseData
  }

  const {
    subscriber: {
      'to-param': toParam,
      'subscriber-uri': subscriberUri
    }
  } = xmlToJson(responseData)

  return {
    subscriber: {
      id: toParam._text,
      uri: subscriberUri._text
    }
  }
}
