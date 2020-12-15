module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
    serviceworker: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  ignorePatterns: ["package.json", "package-lock.json"],
  rules: {
    camelcase: 0,
    "comma-dangle": ["error", "only-multiline"],
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["constants", "./src/constants"],
          ["reducer", "./src/reducer"],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    react: { version: "detect" },
  },
};
