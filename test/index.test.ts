import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('parse-salesforce-object', () => {
  test
  .stdout()
  .do(() => cmd.run(['./test/Expense__c.object']))
  .it('no option (markdown)', ctx => {
    const expected = `| label       | fullName      | type     | required |
| ----------- | ------------- | -------- | -------- |
| Amount      | Amount__c     | Number   | false    |
| Client      | Client__c     | Text     | false    |
| Date        | Date__c       | DateTime | false    |
| Reimbursed? | Reimbursed__c | Checkbox |          |`
    expect(ctx.stdout).to.contain(expected)
  })

  test
  .stdout()
  .do(() => cmd.run(['--format=csv', './test/Expense__c.object']))
  .it('--format=csv (csv)', ctx => {
    const expected = `"label","fullName","type","required"
"Amount","Amount__c","Number","false"
"Client","Client__c","Text","false"
"Date","Date__c","DateTime","false"
"Reimbursed?","Reimbursed__c","Checkbox",
`
    expect(ctx.stdout).to.contain(expected)
  })

  test
  .stdout()
  .do(() => cmd.run(['--format=soql', './test/Expense__c.object']))
  .it('--format=soql (soql)', ctx => {
    const expected = `SELECT Id,
Amount__c,
Client__c,
Date__c,
Reimbursed__c
FROM Expense__c
`
    expect(ctx.stdout).to.contain(expected)
  })

  test
  .stdout()
  .do(() => cmd.run(['--format=soql', '--namespace=foo', './test/Expense__c.object']))
  .it('--format=soql --namespace=foo (soql format with namespace)', ctx => {
    const expected = `SELECT Id,
foo__Amount__c,
foo__Client__c,
foo__Date__c,
foo__Reimbursed__c
FROM foo__Expense__c
`
    expect(ctx.stdout).to.contain(expected)
  })
})
