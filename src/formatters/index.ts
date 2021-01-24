import {soqlFormatter} from './soql-formatter'
import {csvFormatter} from './csv-formatter'
import {Field} from '../parsers'

export type Options = {
  namespace?: string;
  fieldNames?: string[];
  path?: string;
}

export type Formatter = {
  format: (fields: Field[], options: Options) => string;
}

export function getFormatter(type: 'soql' | 'markdown' |'csv'): Formatter {
  return {
    csv: csvFormatter,
    markdown: soqlFormatter,
    soql: soqlFormatter,
  }[type]
}
