parse-salesforce-object
=======================

Parse Salesforce object metadata (e.g. `Foo__c.object`) and display fields as Markdown/CSV.

## Installation

```zsh
$ npm install -g parse-salesforce-object
```

## Usage

```zsh
# Display as Markdown table
$ sfobj path/to/CustomObject__c.object
| label       | fullName      | type     | required |
| ----------- | ------------- | -------- | -------- |
| Amount      | Amount__c     | Number   | false    |
| Client      | Client__c     | Text     | false    |
| Date        | Date__c       | DateTime | false    |
| Reimbursed? | Reimbursed__c | Checkbox | null     |

# use --format=csv to display as CSV
$ sfobj --format=csv path/to/CustomObject__c.object
"label","fullName","type","required"
"Amount","Amount__c","Number","false"
"Client","Client__c","Text","false"
"Date","Date__c","DateTime","false"
"Reimbursed?","Reimbursed__c","Checkbox",
```
