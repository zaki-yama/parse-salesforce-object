const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const path_ = require('path')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const json2csv = require('json2csv')
const gfmt = require('gfmt')

class ParseSalesforceObjectCommand extends Command {
  async run() {
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

    const {args, flags} = this.parse(ParseSalesforceObjectCommand)
    fs.readFile(args.path, (err, data) => {
      parser.parseString(data, (err, result) => {
        if (err || !(result.CustomObject && result.CustomObject.fields)) {
          this.error('ERROR: Invalid XML format.')
        }
        for (const field of result.CustomObject.fields) {
          const data = {}
          for (const property of props) {
            data[property] = field[property] ? field[property][0] : null
          }
          dataList.push(data)
        }
      })

      let result
      switch (flags.format) {
      case 'soql':
        const prefix = flags.namespace ? `${flags.namespace}__` : ''
        const objName = path_.basename(args.path).split('.')[0]
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
    })
  }
}

ParseSalesforceObjectCommand.args = [
  {
    name: 'path',
    description: 'path to .object file',
    required: true,
  },
]

ParseSalesforceObjectCommand.flags = {
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

module.exports = ParseSalesforceObjectCommand
