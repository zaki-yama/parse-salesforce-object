import {soqlFormatter} from './soql-formatter'
import {csvFormatter} from './csv-formatter'
import {markdownFormatter} from './markdown-formater'
import {Field} from '../parsers'

export type Options = {
  fieldNames: string[];
  namespace?: string;
  path?: string;
}

export type Formatter = {
  format: (fields: Field[], options: Options) => string;
}

export function getFormatter(type: 'soql' | 'markdown' |'csv'): Formatter {
  return {
    csv: csvFormatter,
    markdown: markdownFormatter,
    soql: soqlFormatter,
  }[type]
}
