import {promises as fs} from 'fs'
import {parseStringPromise} from 'xml2js'

import type {Field} from '.'

export async function parseMetadataFormat(objectFilePath: string) {
  const xml = await fs.readFile(objectFilePath, 'utf-8')

  const sObject = await parseStringPromise(xml)
  return sObject.CustomObject.fields as Field[]

  // for (const field of parsed.CustomObject.fields) {
  //   // FIXME: Avoid `any` type
  //   const data: any = {}
  //   for (const property of props) {
  //     console.log('field[property]', field[property])
  //     data[property] = field[property] ? field[property][0] : null
  //   }
  //   dataList.push(data)
  // }
}
