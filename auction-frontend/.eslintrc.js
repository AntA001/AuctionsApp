const [OFF, WARNING, ERROR] = [0, 1, 2];

module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: 'tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react', 'prettier', 'import', 'react-hooks'],
  rules: {
    '@typescript-eslint/camelcase': OFF,
    '@typescript-eslint/no-shadow': OFF,
    'consistent-return': OFF,
    'default-case': OFF,
    'hubfinance/icon-imports': OFF,
    'hubfinance/set-svg-size': OFF,
    'import/order': [
      ERROR,
      {
        'newlines-between': 'always',
        groups: [
          ['external', 'builtin'],
          'internal',
          'parent',
          ['index', 'sibling'],
          'object',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
      },
    ],
    'import/prefer-default-export': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/label-has-associated-control': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,
    'jsx-a11y/no-noninteractive-tabindex': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
    'no-multi-str': OFF,
    'no-nested-ternary': OFF,
    'no-param-reassign': OFF,
    'no-plusplus': OFF,
    'no-restricted-globals': OFF,
    'no-restricted-syntax': OFF,
    'no-undef': OFF,
    'no-underscore-dangle': OFF,
    'prettier/prettier': ERROR,
    'react/destructuring-assignment': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/no-array-index-key': OFF,
    'react/no-danger': OFF,
    'react/no-unescaped-entities': OFF,
    'react/prop-types': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/require-default-props': OFF,
    'react/state-in-constructor': OFF,
    'react/static-property-placement': OFF,
    'react-hooks/exhaustive-deps': OFF,
    'symbol-description': OFF,
    'class-methods-use-this': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/ban-types': OFF,
    '@typescript-eslint/no-inferrable-types': OFF,
    '@typescript-eslint/no-empty-interface': OFF,
    '@typescript-eslint/no-namespace': OFF,
    '@typescript-eslint/ban-ts-comment': WARNING,
    'import/no-cycle': WARNING,
  },
};
