import * as table from 'markdown-table'
import * as stringWidth from 'string-width'

import {Formatter} from '.'

export const markdownFormatter: Formatter = {
  format: (fields, options) => {
    return table([options.fieldNames, ...fields.map(field => Object.values(field))], {
      stringLength: stringWidth,
    })
  },
}
