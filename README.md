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

# Use `--format=csv` (or `-f csv`) to display as CSV
$ sfobj --format=csv path/to/CustomObject__c.object
"label","fullName","type","required"
"Amount","Amount__c","Number","false"
"Client","Client__c","Text","false"
"Date","Date__c","DateTime","false"
"Reimbursed?","Reimbursed__c","Checkbox",

# It also supports `--format=soql` (or `-f soql`) to display as SOQL query format.
$ sfobj --format=soql path/to/CustomObject__c.object
SELECT Id,
Amount__c,
Client__c,
Date__c,
Reimbursed__c
FROM CustomObject__c

# SOQL format with namespace prefix
$ sfobj --format=soql --namespace=foo path/to/CustomObject__c.object
SELECT Id,
foo__Amount__c,
foo__Client__c,
foo__Date__c,
foo__Reimbursed__c
FROM foo__CustomObject__c
```
