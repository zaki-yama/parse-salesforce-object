import {Command, flags} from '@oclif/command'

import * as table from 'markdown-table'
import * as stringWidth from 'string-width'
import {parseSObjectFile, fieldProperties} from './parsers'
import {getFormatter} from './formatters'

class ParseSalesforceObject extends Command {
  // TODO
  // static description = 'describe the command here'

  static examples = [
    `$ parse-salesforce-object force-app/main/default/objects/Expense__c/Expense__c.object-meta.xml
| label       | fullName      | type     | required |
| ----------- | ------------- | -------- | -------- |
| Amount      | Amount__c     | Number   | false    |
| Client      | Client__c     | Text     | false    |
| Date        | Date__c       | DateTime | false    |
| Reimbursed? | Reimbursed__c | Checkbox |          |
`,
  ]

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    // add --help flag to show CLI version
    help: flags.help({char: 'h'}),

    format: flags.string({
      char: 'f',
      description: 'output format',
      options: ['markdown', 'csv', 'soql'],
      default: 'markdown',
    }),
    namespace: flags.string({
      char: 'n',
      description: 'namespace prefix (for SOQL format)',
    }),
  }

  static args = [{
    name: 'path',
    description: 'path to sObject file',
    required: true,
  }]

  async run() {
    const {args, flags} = this.parse(ParseSalesforceObject)

    const props = [
      'label',
      'fullName',
      'type',
      'required',
      // 'externalId',
      // 'caseSensitive',
      // 'length',
      // 'trackTrending',
      // 'unique',
    ]

    // parse sobject file
    // const Parser = args.path.includes('object-meta.xml') ? SourceFormatParser : MetadataFormatParser
    const rawFields = await parseSObjectFile(args.path)

    const dataList = []
    for (const field of rawFields) {
      const data: any = {}
      for (const property of fieldProperties) {
        this.debug(field[property])
        data[property] = field[property] ? field[property][0] : null
      }
      dataList.push(data)
    }

    let result

    switch (flags.format) {
    case 'soql': {
      const formatter = getFormatter('soql')
      result = formatter.format(dataList, {namespace: flags.namespace, path: args.path})
      break
    }
    case 'csv': {
      const formatter = getFormatter('csv')
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      result = formatter.format(dataList, {namespace: flags.namespace, path: args.path, fieldNames: fieldProperties})
      break
    }
    default:
      // markdown
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      result = table([props, ...dataList.map(data => Object.values(data))], {
        stringLength: stringWidth,
      })
    }
    this.log(result)
  }
}

export = ParseSalesforceObject
