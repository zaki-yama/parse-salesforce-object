import { parse } from "json2csv";
import { Formatter } from ".";

export const csvFormatter: Formatter = {
  format: (fields, options) => {
    return parse(fields, { fields: options.fieldNames });
  },
};
