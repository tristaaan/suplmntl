module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'only-multiline',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never'
    }],
    'no-alert': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'block-spacing': 0,
    'react/forbid-prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/require-default-props': 0,
    'object-curly-newline': ['error', {
        'ObjectPattern': { 'multiline': false },
    }]
  }
};
