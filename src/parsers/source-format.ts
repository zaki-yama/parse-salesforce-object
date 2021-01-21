import {promises as fs} from 'fs'
import {promisify} from 'util'
import * as glob from 'glob'
import * as path from 'path'

import {parseStringPromise} from 'xml2js'

export const fieldProperties = [
  'label',
  'fullName',
  'type',
  'required',
] as const

type FieldProperty = typeof fieldProperties[number];

type Field = {
  [property in FieldProperty]: string;
}

async function fetchField(fieldFilePath: string) {
  console.log('field file path: ', fieldFilePath)
  const xml = await fs.readFile(fieldFilePath)
  const field = await parseStringPromise(xml)
  return field.CustomField as Field
}

export async function parseSourceFormat(objectFilePath: string) {
  console.log('object file path: ', objectFilePath)
  // const files = await globSync(path.resolve(objectFilePath, 'fields', '*.field-meta.xml'), {})
  const promises = glob.sync(path.resolve(objectFilePath, '..', 'fields', '*.field-meta.xml'))
  .map(fieldFilePath => fetchField(fieldFilePath))
  const fields = await Promise.all(promises)
  return fields
}
