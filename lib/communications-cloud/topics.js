'use strict'

const { jsonToXml, request, xmlToJson } = require('../util')

module.exports = {
  // changeCategories,
  create,
  // delete,
  // list,
  // listCategories,
  // read,
  // update,
}

async function create({
  code,
  name,
  shortName,
  description,
  sendByEmailEnabled,
  wirelessEnabled,
  rssFeedUrl,
  rssFeedTitle,
  rssFeedDescription,
  pagewatchEnabled,
  pagewatchSuspended,
  defaultPagewatchResults,
  pagewatchAutosend,
  pagewatchType,
  watchTaggedContent,
  pages,
  page,
  url,
  visibility,
  categories,
  category,

  raw = false
} = {}, requestSettings) {
  // TODO: input validation

  return true
}
