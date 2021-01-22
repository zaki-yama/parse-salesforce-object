import {soqlFormatter} from './soql-formatter'

export function getFormatter(type: 'soql' | 'markdown') {
  return {
    markdown: soqlFormatter,
    soql: soqlFormatter,
  }[type]
}
