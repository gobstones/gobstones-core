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
            },
            {
                sourcemap: true,
                file: 'dist/index.cjs',
                format: 'cjs'
            }
        ],
        plugins: [
            typescript(),
            commonjs(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ]
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
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript(),
            commonjs(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ],
        external: ['fs']
    }
];
