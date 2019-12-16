module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-return': [0],
    'vue/no-unused-vars': [0],
    'no-unused-expressions': [0]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
