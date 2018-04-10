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
| Reimbursed? | Reimbursed__c | Checkbox | null     |`
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
})
