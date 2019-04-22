'use strict'

const axios = require('axios')
const { json2xml, xml2js } = require('xml-js')

const ø = Object.create(null)

module.exports = {
  partiallyApplyAll,
  invokeWithNew,

  jsonToXml,
  xmlToJson,

  request
}

/**
  * Partially apply appended arguments to an object of functions and
  * returns the object.
  *
  * Used throughout the library to append a request settings object to every
  * function that makes a request:
  * ```
  * client.subscriptions.add(settings, requestSettings)
  * ```
  */
function partiallyApplyAll (object, ...appendedArgs) {
  return Object.keys(object)
    .reduce((boundObject, func) => {
      boundObject[func] = function (...args) {
        return object[func].apply(ø, [...args, ...appendedArgs])
      }

      return boundObject
    }, {})
}

/**
 * Traps a function to be invoked as a constructor call with new.
 *
 * Used throughout the library so both:
 * ```
 *   const client = CommuncationsCloud(...)
 *   const client = new CommunicatonsCloud(...)
 *  ```
 * have the same behavior.
 */
function invokeWithNew (func) {
  return new Proxy(func, {
    apply (target, _context, args) {
      return new target(...args)
    }
  })
}

// # JSON <-> XML ------------------------------------------------------------

function jsonToXml (json) {
  return json2xml(json, { compact: true })
}

function xmlToJson (xml) {
  return xml2js(xml, {
    compact: true,
    trim: true
  })
}

// # Requests/responses ------------------------------------------------------

const GovDeliveryError = invokeWithNew(class extends Error {
  constructor(message, { code, status },...params) {
    super(`[${code}] [HTTP ${status}] ${message}`, ...params)

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Examples
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GovDeliveryError)
    }

    // GovDelivery-specific error code
    this.code = code
    // the description of the error that GovDelivery API returns with the key
    // "error"
    this.error = message
    // HTTP status code
    this.status = status
  }
})

// TODO: Handle network errors
async function request ({
  auth,
  baseUrl: baseURL,
  data,
  headers,
  method,
  url
}) {
  try {
    let { data: responseData } = await axios({
      auth,
      baseURL,
      data,
      headers,
      method,
      // TODO: Make configurable
      timeout: 3000,
      url
    })

    return responseData
  } catch (error) {
    if (Error.prototype.isPrototypeOf(error)) {
      // ...then this is most likely an axios error
      throw error
    }

    const { response: { data, status } } = error

    const {
      errors: {
        code: { _text: code },
        error: { _text: message }
      }
    } = xmlToJson(data)

    throw GovDeliveryError(message, { code, status })
  }
}
