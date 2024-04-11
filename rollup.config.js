/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const { config } = require('@gobstones/gobstones-scripts');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

config.init();
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

module.exports = [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                file: packageJson.exports['.'].import.default,
                format: 'esm'
            },
            {
                sourcemap: true,
                file: packageJson.exports['.'].require.default,
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: `${tsConfigPath}`,
                declarationDir: './typings'
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/]
    },
    {
        input: 'src/cli.ts',
        output: [
            {
                sourcemap: true,
                file: packageJson.exports['./cli'].import.default,
                format: 'esm'
            },
            {
                sourcemap: true,
                file: packageJson.exports['./cli'].require.default,
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript({
                tsconfig: `${tsConfigPath}`,
                declarationDir: './typings'
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/, 'commander', 'fs']
    }
];
