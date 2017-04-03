#! /usr/bin/env node
const fs = require('fs-extra');
const xml2js  = require('xml2js');
const parser = new xml2js.Parser();
const json2csv = require('json2csv');
const gfmt = require('gfmt');

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
];
const dataList = [];

fs.readFile(process.argv[2], (err, data) => {
  parser.parseString(data, (err, result) => {
    for (const field of result.CustomObject.fields) {
      const data = {};
      for (const property of props) {
        data[property] = field[property] ? field[property][0] : null;
      }
      dataList.push(data);
    }
  });

  const csv = json2csv({ data: dataList, fields: props });
  console.log(csv);

  const table = gfmt(dataList);
  console.log(table);
});
