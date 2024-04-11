module.exports = {
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['**/Subset.ts'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        impliedStrict: true,
        warnOnUnsupportedTypeScriptVersion: false
    },
    env: {
        node: true
    },
    plugins: ['@typescript-eslint', 'import', 'no-null', 'prefer-arrow', 'prettier', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'prettier/prettier',
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
    rules: {
        '@typescript-eslint/array-type': ['error'],
        '@typescript-eslint/ban-types': ['error'],
        '@typescript-eslint/consistent-type-definitions': ['error'],
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true
            }
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit'
            }
        ],
        '@typescript-eslint/member-ordering': [
            'error',
            {
                default: {
                    memberTypes: [
                        // Static
                        // ======
                        // fields
                        'public-static-field',
                        'protected-static-field',
                        'private-static-field',
                        '#private-static-field',
                        'static-field',
                        // accessors
                        'public-static-accessor',
                        'protected-static-accessor',
                        'private-static-accessor',
                        '#private-static-accessor',
                        'static-accessor',
                        // initialization
                        'static-initialization',
                        // Getter and setter
                        ['public-static-get', 'public-static-set'],
                        ['protected-static-get', 'protected-static-set'],
                        ['private-static-get', 'private-static-set'],
                        ['#private-static-get', '#private-static-set'],
                        ['static-get', 'static-set'],
                        // Methods
                        'public-static-method',
                        'protected-static-method',
                        'private-static-method',
                        '#private-static-method',
                        'static-method',

                        // Instance
                        // ========
                        // Index signature
                        'signature',
                        'call-signature',

                        // Fields
                        'public-abstract-field',
                        'protected-abstract-field',

                        'public-decorated-field',
                        'protected-decorated-field',
                        'private-decorated-field',

                        'public-instance-field',
                        'protected-instance-field',
                        'private-instance-field',
                        '#private-instance-field',

                        'public-field',
                        'protected-field',
                        'private-field',
                        '#private-field',

                        'abstract-field',
                        'instance-field',

                        'decorated-field',

                        'field',

                        // Constructors
                        'public-constructor',
                        'protected-constructor',
                        'private-constructor',
                        'constructor',

                        // Accessors
                        'public-abstract-accessor',
                        'protected-abstract-accessor',

                        'public-decorated-accessor',
                        'protected-decorated-accessor',
                        'private-decorated-accessor',

                        'public-instance-accessor',
                        'protected-instance-accessor',
                        'private-instance-accessor',
                        '#private-instance-accessor',

                        'public-accessor',
                        'protected-accessor',
                        'private-accessor',
                        '#private-accessor',

                        'abstract-accessor',
                        'instance-accessor',

                        'decorated-accessor',

                        'accessor',

                        // Getters and Setter
                        ['public-abstract-get', 'public-abstract-set'],
                        ['protected-abstract-get', 'protected-abstract-set'],

                        ['public-decorated-get', 'public-decorated-set'],
                        ['protected-decorated-get', 'protected-decorated-set'],
                        ['private-decorated-get', 'private-decorated-set'],

                        ['public-instance-get', 'public-instance-set'],
                        ['protected-instance-get', 'protected-instance-set'],
                        ['private-instance-get', 'private-instance-set'],
                        ['#private-instance-get', '#private-instance-set'],

                        ['public-get', 'public-set'],
                        ['protected-get', 'protected-set'],
                        ['private-get', 'private-set'],
                        ['#private-get', '#private-set'],

                        ['abstract-get', 'abstract-set'],
                        ['decorated-get', 'decorated-set'],
                        ['instance-get', 'instance-set'],

                        ['get', 'set'],

                        // Methods
                        'public-abstract-method',
                        'protected-abstract-method',

                        'public-decorated-method',
                        'protected-decorated-method',
                        'private-decorated-method',

                        'public-instance-method',
                        'protected-instance-method',
                        'private-instance-method',
                        '#private-instance-method',

                        'public-method',
                        'protected-method',
                        'private-method',
                        '#private-method',

                        'abstract-method',
                        'instance-method',

                        'decorated-method',

                        'method'
                    ]
                }
            }
        ],
        '@typescript-eslint/no-empty-function': ['error'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-inferrable-types': ['off'],
        '@typescript-eslint/no-namespace': ['off'],
        '@typescript-eslint/no-parameter-properties': ['off'],
        '@typescript-eslint/no-shadow': [
            'error',
            {
                hoist: 'all'
            }
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'none',
                ignoreRestSiblings: false
            }
        ],
        '@typescript-eslint/prefer-for-of': ['error'],
        '@typescript-eslint/prefer-function-type': ['error'],
        '@typescript-eslint/prefer-namespace-keyword': ['error'],
        '@typescript-eslint/triple-slash-reference': ['error'],
        '@typescript-eslint/unified-signatures': ['error'],

        'no-null/no-null': ['error'],

        'prettier/prettier': ['error'],

        'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
                disallowPrototype: true,
                singleReturnOnly: true,
                classPropertiesAllowed: false
            }
        ],

        'import/no-unresolved': ['error', { ignore: ['^@?[\\w\\d-_]+/?[\\w\\d-_]+/[\\w\\d-_]+$'] }],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
                'newlines-between': 'always',
                alphabetize: {
                    /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
                    order: 'asc',
                    /* ignore case. Options: [true, false] */
                    caseInsensitive: true
                }
            }
        ],

        'arrow-body-style': ['error'],
        camelcase: ['error'],
        'capitalized-comments': ['off'],
        'comma-dangle': [
            'error',
            {
                objects: 'never',
                arrays: 'never',
                functions: 'never'
            }
        ],
        complexity: ['off'],
        'default-case': ['error'],
        'dot-location': ['error', 'property'],
        eqeqeq: ['error', 'smart'],
        'max-len': [
            'error',
            {
                code: 120,
                ignoreUrls: true
            }
        ],
        'no-alert': ['error'],
        'no-bitwise': ['error'],
        'no-caller': ['error'],
        'no-console': ['error'],
        'no-constructor-return': ['error'],
        'no-div-regex': ['error'],
        'no-empty': ['error'],
        'no-empty-function': [
            'error',
            {
                allow: ['constructors']
            }
        ],
        'no-eval': ['error'],
        'no-extra-bind': ['error'],
        'no-import-assign': ['error'],
        'no-invalid-this': ['error'],
        'no-labels': ['error'],
        'no-multiple-empty-lines': ['error'],
        'no-new-wrappers': ['error'],
        'no-regex-spaces': ['error'],
        'no-return-assign': ['error'],
        'no-return-await': ['error'],
        'no-self-compare': ['error'],
        'no-shadow': ['off'],
        'no-throw-literal': ['error'],
        'no-undef-init': ['error'],
        'no-underscore-dangle': ['off'],
        'no-unused-expressions': ['error'],
        'no-useless-call': ['error'],
        'no-useless-concat': ['error'],
        'no-var': ['error'],
        'object-shorthand': ['error'],
        'one-var': ['error', 'never'],
        'prefer-const': ['error'],
        'prefer-regex-literals': ['error'],
        radix: ['error'],
        'require-await': ['error'],
        'spaced-comment': ['error'],
        'use-isnan': ['error'],
        'valid-typeof': ['error'],
        yoda: ['error']
    }
};
