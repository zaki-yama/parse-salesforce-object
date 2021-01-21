import {promises as fs} from 'fs'
import * as glob from 'glob'
import * as path from 'path'
import {parseStringPromise} from 'xml2js'

import type {Field} from '.'

async function fetchField(fieldFilePath: string) {
  const xml = await fs.readFile(fieldFilePath)
  const field = await parseStringPromise(xml)
  return field.CustomField as Field
}

export async function parseSourceFormat(objectFilePath: string) {
  // const files = await globSync(path.resolve(objectFilePath, 'fields', '*.field-meta.xml'), {})
  const promises = glob.sync(path.resolve(objectFilePath, '..', 'fields', '*.field-meta.xml'))
  .map(fieldFilePath => fetchField(fieldFilePath))
  const fields = await Promise.all(promises)
  return fields
}
