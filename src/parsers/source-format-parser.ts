import {promises as fs} from 'fs'
import * as glob from 'glob'
import * as path from 'path'
import {parseStringPromise} from 'xml2js'

import {Parser} from '.'

async function fetchField(fieldFilePath: string) {
  const xml = await fs.readFile(fieldFilePath)
  const field = await parseStringPromise(xml)
  return field.CustomField
}

export const sourceFormatParser: Parser = {
  parse: async function (objectFilePath: string) {
    const promises = glob.sync(
      path.resolve(objectFilePath, '..', 'fields', '*.field-meta.xml')
    )
    .map(fieldFilePath => fetchField(fieldFilePath))
    const fields = await Promise.all(promises)
    return fields
  },
}
