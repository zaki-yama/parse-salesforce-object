parse-salesforce-object
=======================

[![Version](https://img.shields.io/npm/v/parse-salesforce-object.svg)](https://npmjs.org/package/parse-salesforce-object)
[![License](https://img.shields.io/npm/l/parse-salesforce-object.svg)](https://github.com/zaki-yama/parse-salesforce-object/blob/master/package.json)

Parse Salesforce object metadata (e.g. `Expense__c.object-meta.xml`) and display fields as Markdown/CSV/SOQL.

## Installation

```zsh
$ npm install -g parse-salesforce-object
```

## Usage

```zsh
# Display as Markdown table
$ parse-salesforce-object path/to/CustomObject__c.object-meta.xml
| label       | fullName      | type     | required |
| ----------- | ------------- | -------- | -------- |
| Amount      | Amount__c     | Number   | false    |
| Client      | Client__c     | Text     | false    |
| Date        | Date__c       | DateTime | false    |
| Reimbursed? | Reimbursed__c | Checkbox | null     |

# Use `--format=csv` (or `-f csv`) to display as CSV
$ parse-salesforce-object --format=csv path/to/CustomObject__c.object-meta.xml
"label","fullName","type","required"
"Amount","Amount__c","Number","false"
"Client","Client__c","Text","false"
"Date","Date__c","DateTime","false"
"Reimbursed?","Reimbursed__c","Checkbox",

# It also supports `--format=soql` (or `-f soql`) to display as SOQL query format.
$ parse-salesforce-object --format=soql path/to/CustomObject__c.object-meta.xml
SELECT Id,
Amount__c,
Client__c,
Date__c,
Reimbursed__c
FROM CustomObject__c

# SOQL format with namespace prefix
$ parse-salesforce-object --format=soql --namespace=foo path/to/CustomObject__c.object-meta.xml
SELECT Id,
foo__Amount__c,
foo__Client__c,
foo__Date__c,
foo__Reimbursed__c
FROM foo__CustomObject__c
```
