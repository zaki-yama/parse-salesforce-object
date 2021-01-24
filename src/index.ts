import {Command, flags} from '@oclif/command'

import {parseSObjectFile, fieldProperties} from './parsers'
import {getFormatter} from './formatters'

const FIELD_NAMES = [
  'label',
  'fullName',
  'type',
  'required',
]

type RawField = {
  [key: string]: string;
}

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

    // parse sobject file
    // const Parser = args.path.includes('object-meta.xml') ? SourceFormatParser : MetadataFormatParser
    const rawFields = await parseSObjectFile(args.path)

    const fields = this.extractFields(rawFields, FIELD_NAMES)

    const formatter = getFormatter(flags.format as 'soql' | 'markdown' |'csv')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const result = formatter.format(fields, {namespace: flags.namespace, path: args.path, fieldNames: fieldProperties})
    this.log(result)
  }

  extractFields(rawFields: RawField[], fieldNames: string[]) {
    return rawFields.map(rawField => {
      const field: any = {}
      fieldNames.forEach(fieldName => {
        this.debug(field[fieldName])
        field[fieldName] = rawField[fieldName] ? rawField[fieldName][0] : null
      })
      return field
    })
  }
}

export = ParseSalesforceObject
