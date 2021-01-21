import {expect, test} from '@oclif/test'

import cmd = require('../src')

const expected = {
  markdown: `| label         | fullName      | type     | required |
| ------------- | ------------- | -------- | -------- |
| 金額          | Amount__c     | Number   | false    |
| クライアント  | Client__c     | Text     | false    |
| 日付          | Date__c       | DateTime | false    |
| 払い戻し済み? | Reimbursed__c | Checkbox |          |`,

  csv: `"label","fullName","type","required"
"金額","Amount__c","Number","false"
"クライアント","Client__c","Text","false"
"日付","Date__c","DateTime","false"
"払い戻し済み?","Reimbursed__c","Checkbox",
`,

  soql: `SELECT Id,
Amount__c,
Client__c,
Date__c,
Reimbursed__c
FROM Expense__c
`,

  soql_namespace: `SELECT Id,
foo__Amount__c,
foo__Client__c,
foo__Date__c,
foo__Reimbursed__c
FROM foo__Expense__c
`,
}

describe('Metadata format', () => {
  test
  .stdout()
  .do(() => cmd.run(['./test/fixtures/metadata-format/Expense__c.object']))
  .it('no option (markdown)', ctx => {
    expect(ctx.stdout).to.contain(expected.markdown)
  })

  test
  .stdout()
  .do(() => cmd.run(['--format=csv', './test/fixtures/metadata-format/Expense__c.object']))
  .it('--format=csv (csv)', ctx => {
    expect(ctx.stdout).to.contain(expected.csv)
  })

  test
  .stdout()
  .do(() => cmd.run(['--format=soql', './test/fixtures/metadata-format/Expense__c.object']))
  .it('--format=soql (soql)', ctx => {
    expect(ctx.stdout).to.contain(expected.soql)
  })

  test
  .stdout()
  .do(() => cmd.run(['--format=soql', '--namespace=foo', './test/fixtures/metadata-format/Expense__c.object']))
  .it('--format=soql --namespace=foo (soql format with namespace)', ctx => {
    expect(ctx.stdout).to.contain(expected.soql_namespace)
  })
})
