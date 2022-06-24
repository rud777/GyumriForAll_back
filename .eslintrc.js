module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-shadow': 'off',
    'no-restricted-syntax': [0, 'FunctionExpression', 'WithStatement', "BinaryExpression[operator='in']"],
    'no-use-before-define': [0, {
      functions: true,
      classes: true,
      variables: true,
      allowNamedExports: false,
    }],
    'no-restricted-globals': [0, 'event', 'fdescribe'],
    'import/prefer-default-export': 'off',
  },
};
