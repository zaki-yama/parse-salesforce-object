import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'

import {parse} from 'json2csv'
import * as table from 'markdown-table'
import * as stringWidth from 'string-width'
import {parseString} from 'xml2js'

async function xml2js(xml: string) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    parseString(xml, function (err: Error, json: string) {
      if (err)
        reject(err)
      else
        resolve(json)
    })
  })
}

class ParseSalesforceObject extends Command {
  // TODO
  // static description = 'describe the command here'

  static examples = [
    `$ parse-salesforce-object src/objects/Expense__c.object
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
    description: 'path to .object file',
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
    const dataList = []

    const xml = fs.readFileSync(args.path, 'utf-8')
    try {
      // FIXME: Avoid `any` type
      const parsed: any = await xml2js(xml)
      for (const field of parsed.CustomObject.fields) {
        // FIXME: Avoid `any` type
        const data: any = {}
        for (const property of props) {
          data[property] = field[property] ? field[property][0] : null
        }
        dataList.push(data)
      }
    // eslint-disable-next-line unicorn/catch-error-name
    } catch (err) { // tslint:disable-line no-unused
      this.error('ERROR: Invalid XML format.')
    }

    let result
    switch (flags.format) {
    case 'soql': {
      const prefix = flags.namespace ? `${flags.namespace}__` : ''
      const objName = path.basename(args.path).split('.')[0]
      const fields = dataList.map(data => {
        return `${prefix}${data.fullName}`
      })
      result = [
        'SELECT Id,',
        fields.join(',\n'),
        `FROM ${prefix}${objName}`,
      ].join('\n')
      break
    }
    case 'csv':
      result = parse(dataList, {fields: props})
      break
    default:
      // markdown
      result = table([props, ...dataList.map(data => Object.values(data))], {
        stringLength: stringWidth,
      })
    }
    this.log(result)
  }
}

export = ParseSalesforceObject
