module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'arrow-body-style': 1,
    'spaced-comment': 1,
    '@typescript-eslint/no-unused-vars': 1,
    'import/newline-after-import': 1,
    'consistent-return': 1,
    'no-unused-expressions': 1,
    'react/self-closing-comp': 1,
    'lines-between-class-members': 1,
    'prefer-destructuring': 1,
    'no-underscore-dangle': 1,
  },
};
