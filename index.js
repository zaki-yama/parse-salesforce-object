const xml2js  = require('xml2js');
const fs = require('fs-extra');
const parser = new xml2js.Parser();
const json2csv = require('json2csv');

const props = [
  'label',
  'fullName',
  'type',
  'required',
  'externalId',
  // 'caseSensitive',
  // 'length',
  'trackTrending',
  // 'unique',
];
const dataList = [];

fs.readFile(__dirname + '/MyObj__c.object', function(err, data) {
  parser.parseString(data, function (err, result) {
    // console.dir(result);

    for (const field of result.CustomObject.fields) {
      const data = {};
      for (const property of props) {
        data[property] = field[property] ? field[property][0] : null;
      }
      // console.log(data);
      dataList.push(data);
    }
    // console.log('Done');
  });

  const csv = json2csv({ data: dataList, fields: props });
  console.log(csv);
});
