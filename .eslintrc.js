module.exports = {
  extends: 'airbnb',
  globals: {window: true, confirm: true, alert:true, document: true, Blob: true},
  rules: {
    'no-console': 0,
    'no-alert': 0,
    'no-multi-spaces': [2, { exceptions: { "ImportDeclaration": true } }],
    'no-nested-ternary': 0,
    'no-param-reassign': [2, { props: false }],
    'no-unused-vars': [2, { args: 'none' }],
    'no-var': 0,
    'no-underscore-dangle': 0,
    'one-var': 0,
    'block-spacing': 0,
    'global-require': 0,
    'arrow-body-style': 0,
    'comma-dangle': 0,
    'import/no-unresolved': 0,
    'import/first': 0,
    'react/no-is-mounted': 1,
    'react/prefer-es6-class': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,
    'react/jsx-curly-spacing': 0,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-indent': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-filename-extension': 0,
    'react/forbid-prop-types': 0,
    'jsx-a11y/img-has-alt': 0,
    'jsx-a11y/no-static-element-interactions': 0,
  }
};
