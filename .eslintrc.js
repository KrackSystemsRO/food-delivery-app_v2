module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './apps/backend/tsconfig.json',
            './apps/web/tsconfig.json',
            './apps/mobile/tsconfig.json',
            './packages/shared/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
    },
    extends: [
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {}
};
