import { Command, flags } from "@oclif/command";

import { getParser } from "./parsers";
import { getFormatter } from "./formatters";
import type { RawField, Field } from "./fields";

const FIELD_NAMES = ["label", "fullName", "type", "required"];

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
  ];

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    // add --help flag to show CLI version
    help: flags.help({ char: "h" }),

    format: flags.string({
      char: "f",
      description: "output format",
      options: ["markdown", "csv", "soql"],
      default: "markdown",
    }),
    namespace: flags.string({
      char: "n",
      description: "namespace prefix (for SOQL format)",
    }),
  };

  static args = [
    {
      name: "path",
      description: "path to sObject file",
      required: true,
    },
  ];

  async run(): Promise<void> {
    // eslint-disable-next-line no-shadow
    const { args, flags } = this.parse(ParseSalesforceObject);

    const parser = getParser(args.path);
    const rawFields = await parser.parse(args.path);

    const fields = this.extractFields(rawFields, FIELD_NAMES);

    const formatter = getFormatter(flags.format as "soql" | "markdown" | "csv");

    const result = formatter.format(fields, {
      namespace: flags.namespace,
      path: args.path,
      fieldNames: FIELD_NAMES,
    });
    this.log(result);
  }

  extractFields(rawFields: RawField[], fieldNames: string[]): Field[] {
    return rawFields.map((rawField) => {
      const field: any = {};
      fieldNames.forEach((fieldName) => {
        this.debug(field[fieldName]);
        field[fieldName] = rawField[fieldName] ? rawField[fieldName][0] : null;
      });
      return field;
    });
  }
}

export = ParseSalesforceObject;
