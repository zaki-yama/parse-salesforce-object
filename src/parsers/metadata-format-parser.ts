import {promises as fs} from 'fs'
import {parseStringPromise} from 'xml2js'

import {Parser} from '.'

export const metadataFormatParser: Parser = {
  parse: async function (objectFilePath: string) {
    const xml = await fs.readFile(objectFilePath, 'utf-8')

    const sObject = await parseStringPromise(xml)
    return sObject.CustomObject.fields
  },
}
