import {sourceFormatParser} from './source-format-parser'
import {metadataFormatParser} from './metadata-format-parser'
import {RawField} from '../fields'

export type Parser = {
  parse: (sObjectPath: string) => Promise<RawField[]>;
}

export function getParser(objectFilePath: string): Parser {
  return objectFilePath.includes('object-meta.xml') ? sourceFormatParser : metadataFormatParser
}
