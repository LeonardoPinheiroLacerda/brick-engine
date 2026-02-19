import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['dist/', 'node_modules/', 'docs/', 'public/docs/', 'scripts/'],
    },
    // Base config for all files
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,

    // Browser globals for most files
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: { globals: globals.browser },
    },

    // Node globals for config files
    {
        files: ['**/webpack.config.js', 'eslint.config.mjs'],
        languageOptions: { globals: globals.node },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'no-undef': 'off', // globals.node should handle this, but just in case
        },
    },
];
