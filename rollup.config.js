import path from 'path'
import typescript from 'rollup-plugin-typescript2'

const resolveCwd = path.resolve.bind(null, process.cwd())
const pkg = require(resolveCwd('package.json'))
const deps = Object.keys({...pkg.dependencies, ...pkg.peerDependencies})
const reExternal = new RegExp(`^(${deps.join('|')})($|/)`)

export default [
  {
    input: pkg.source,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          include: [resolveCwd('src/**/*')],
          exclude: ['**/*.spec.*', '**/__tests__'],
        },
      }),
    ],
    external: (id) => (deps.length ? reExternal.test(id) : false),
  },
]
