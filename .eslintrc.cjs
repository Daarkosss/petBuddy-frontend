module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "quotes": ["error", "double"], // Enforce the use of double quotes
    "max-len": ["warn", { "code": 120 }], // Enforce maximum line length
    "eqeqeq": ["error", "always"], // Enforce use of === and !==
    "semi": ["error", "always"], // Enforce use of semicolons
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
}
