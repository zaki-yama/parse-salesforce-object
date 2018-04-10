import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'

import * as gfmt from 'gfmt'
import json2csv from 'json2csv'
import {parseString} from 'xml2js'

async function xml2js(xml: string) {
  return new Promise((resolve, reject) => {
    new parseString(xml, function (err: Error, json: string) {
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
| Reimbursed? | Reimbursed__c | Checkbox | null     |
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
      const parsed = await xml2js(xml)
      for (const field of parsed.CustomObject.fields) {
        const data = {}
        for (const property of props) {
          data[property] = field[property] ? field[property][0] : null
        }
        dataList.push(data)
      }
    } catch (err) { // tslint:disable-line no-unused
        this.error('ERROR: Invalid XML format.')
    }

    let result
    switch (flags.format) {
      case 'soql':
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
      case 'csv':
        result = json2csv.parse(dataList, {fields: props})
        break
      default:
        // markdown
        result = gfmt(dataList)
    }
    this.log(result)
  }
}

export = ParseSalesforceObject
