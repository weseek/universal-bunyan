module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'weseek',
    'weseek/typescript',
  ],
  env: {
  },
  plugins: [
  ],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
