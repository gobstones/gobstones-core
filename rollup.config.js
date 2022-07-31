import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import pluginSizes from 'rollup-plugin-sizes';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

// Expected arguments:
// configMinify (boolean: default undefined)
// configShowSizes (boolean: default undefined)
export default (commandLineArgs) => [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                dir: 'dist',
                format: 'es'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript(),
            commonjs(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ]
    },
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                file: 'dist/index.cjs',
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                declaration: true,
                declarationMap: true,
                declarationDir: '/typings'
            }),
            commonjs(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ],
        external: [/@gobstones\/.*/]
    },
    {
        input: 'src/cli.ts',
        output: [
            {
                sourcemap: true,
                dir: 'dist',
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript(),
            commonjs(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ],
        external: [/@gobstones\/.*/, 'fs']
    }
];
