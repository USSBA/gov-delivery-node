'use strict'

const isPlainObject = require('lodash.isplainobject')
const isString = require('lodash.isstring')
const url = require('url')

// const subscribers = require('./subscribers')
const subscriptions = require('./subscriptions')

const { invokeWithNew, partiallyApplyAll } = require('../util')

function initialize (settings) {
  if (!isPlainObject(settings)) {
    throw Error('The provided client settings are invalid')
  }

  ['accountCode', 'baseUrl', 'password', 'username'].forEach(setting => {
    if (!settings.hasOwnProperty(setting) || !isString(settings[setting])) {
      throw Error(`The provided ${setting} is invalid`)
    }
  })

  const requestSettings = {
    auth: {
      username: settings.username,
      password: settings.password
    },
    headers: {
      'Content-Type': 'application/xml; charset: utf-8'
    },
    baseUrl: url.resolve(settings.baseUrl, `/api/account/${settings.accountCode}`)
  }

  // this.subscribers = bindAll(subscribers, this)
  this.subscriptions = partiallyApplyAll(subscriptions, requestSettings)
}

module.exports = invokeWithNew(initialize)
module.exports.CommunicationsCloud = { initialize }
