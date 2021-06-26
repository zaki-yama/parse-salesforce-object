import * as path from "path";

export const soqlFormatter = {
  format: (fields: any, options: any) => {
    const prefix = options.namespace ? `${options.namespace}__` : "";
    const sObjectName = path.basename(options.path).split(".")[0];
    const fieldFullNames = fields.map(
      (field: any) => `${prefix}${field.fullName}`
    );

    return [
      "SELECT Id,",
      fieldFullNames.join(",\n"),
      `FROM ${prefix}${sObjectName}`,
    ].join("\n");
  },
};
