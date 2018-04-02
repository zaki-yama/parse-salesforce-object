import {Command, flags} from '@oclif/command'
import * as fs from 'fs'

class ParseSalesforceObject extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ parse-salesforce-object
hello world from ./src/parse-salesforce-object.ts!
`,
  ]

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    // add --help flag to show CLI version
    help: flags.help({char: 'h'}),

    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{
    name: 'path',
    description: 'path to .object file',
    required: true,
  }]

  async run() {
    const {args, flags} = this.parse(ParseSalesforceObject)

    fs.readFile(args.path, (err, data) => {
      // TODO
    })
  }
}

export = ParseSalesforceObject
