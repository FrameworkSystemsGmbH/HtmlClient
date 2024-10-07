import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";

// Export our config array, which is composed together thanks to the typed utility function from typescript-eslint
export default tseslint.config(
  {
    // Everything in this config object targets our TypeScript files (Components, Directives, Pipes etc)
    files: ["**/*.js", "**/*.ts"],
    extends: [
      // Apply the recommended core rules
      eslint.configs.all,
      // Apply the recommended TypeScript rules
      ...tseslint.configs.recommended,
      ...tseslint.configs.strict,
      // Optionally apply stylistic rules from typescript-eslint that improve code consistency
      ...tseslint.configs.stylistic,
      // Apply the recommended Angular rules
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // Set the custom processor which will allow us to have our inline Component templates extracted
    // and treated as if they are HTML files (and therefore have the .html config below applied to them)
    processor: angular.processInlineTemplates,
    // Override specific rules for TypeScript files (these will take priority over the extended configs above)
    rules: {
      camelcase: "off",
      "capitalized-comments": "off",
      "class-methods-use-this": "off",
      complexity: "off",
      "default-case": "off",
      eqeqeq: "off",
      "func-names": "off",
      "func-style": "off",
      "id-length": "off",
      "line-comment-position": "off",
      "max-depth": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "max-statements": "off",
      "max-statements-per-line": "off",
      "multiline-comment-style": "off",
      "new-cap": "off",
      "no-bitwise": "off",
      "no-case-declarations": "off",
      "no-cond-assign": "off",
      "no-console": "off",
      "no-continue": "off",
      "no-else-return": "off",
      "no-eq-null": "off",
      "no-extend-native": "off",
      "no-inline-comments": "off",
      "no-negated-condition": "off",
      "no-plusplus": "off",
      "no-ternary": "off",
      "no-underscore-dangle": "off",
      "no-undefined": "off",
      "no-useless-escape": "off",
      "no-void": "off",
      "one-var": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "quote-props": "off",
      "require-unicode-regexp": "off",
      "sort-imports": "off",
      "sort-keys": "off",
      "spaced-comment": "off",
      // Note: you must disable the base rule as it can report incorrect errors
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error",

      "@typescript-eslint/array-type": ["error", {
        default: "generic",
        readonly: "generic",
      }],

      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "dot-notation": "off",
      "@typescript-eslint/dot-notation": "off",
      "init-declarations" :"off",
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/lines-between-class-members": "off",

      "@typescript-eslint/member-ordering": ["error", {
        default: [
          "signature",
          "call-signature",
          "public-static-field",
          "protected-static-field",
          "private-static-field",
          "#private-static-field",
          "public-decorated-field",
          "protected-decorated-field",
          "private-decorated-field",
          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          "#private-instance-field",
          "public-abstract-field",
          "protected-abstract-field",
          "public-field",
          "protected-field",
          "private-field",
          "#private-field",
          "static-field",
          "instance-field",
          "abstract-field",
          "decorated-field",
          "field",
          "static-initialization",
          "public-constructor",
          "protected-constructor",
          "private-constructor",
          "constructor",
          "static-method",
          "decorated-method",
          "instance-method",
          "abstract-method",
          "method",
        ],
      }],

      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "no-magic-numbers": "off",

      "@typescript-eslint/no-unused-vars": ["error", {
        args: "none",
      }],

      "@typescript-eslint/explicit-module-boundary-types": "off",

      "@typescript-eslint/max-params": "off",


      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/prefer-destructuring": "off",

      "@typescript-eslint/triple-slash-reference": "off",

      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/prefer-literal-enum-member": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@angular-eslint/component-max-inline-declarations": "off",

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'hc',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'hc',
          style: 'kebab-case',
        },
      ],
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
    },
  },
  {
    // Everything in this config object targets our HTML files (external templates,
    // and inline templates as long as we have the `processor` set on our TypeScript config above)
    files: ['**/*.html'],
    extends: [
      // Apply the recommended Angular template rules
      ...angular.configs.templateAll,
      // Apply the Angular template rules which focus on accessibility of our apps
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/attributes-order": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/cyclomatic-complexity": "off",
      "@angular-eslint/template/eqeqeq": "off",
      "@angular-eslint/template/i18n": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/use-track-by-function": "off",
      "@angular-eslint/template/mouse-events-have-key-events": "off",
      "@angular-eslint/template/no-call-expression": "off",
      "@angular-eslint/template/no-inline-styles": "off",
      "@angular-eslint/template/prefer-ngsrc": "off",
    },
  },
);
