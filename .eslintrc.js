module.exports = {
  extends: ["@cybozu/eslint-config/presets/node-typescript-prettier"],
  plugins: ["jest"],
  env: {
    "jest/globals": true,
  },
};
