import {parseSourceFormat} from './source-format'
import {parseMetadataFormat} from './metadata-format'

export const fieldProperties = [
  'label',
  'fullName',
  'type',
  'required',
] as const

type FieldProperty = typeof fieldProperties[number];

export type Field = {
  [property in FieldProperty]: string;
}

export function parseSObjectFile(objectFilePath: string) {
  return objectFilePath.includes('object-meta.xml') ? parseSourceFormat(objectFilePath) : parseMetadataFormat(objectFilePath)
}
