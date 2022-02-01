import { build, BuildOptions } from 'esbuild'
import fs from 'fs/promises'
import path from 'path'

const outDir = path.resolve(__dirname, '../dist')
const cjsOutDir = path.join(outDir, './cjs')
const emsOutDir = path.join(outDir, './esm')
const cjsPackageJsonContent = `{
    "type": "commonjs"
}`
const esmPackageJsonContent = `{
    "type": "module"
}`

const options: BuildOptions = {
    bundle: true,
    entryPoints: [path.resolve(__dirname, '../src/index.tsx')]
}

const prepareOutDir = async () => {
    try {
        await fs.access(outDir)
        await fs.rm(outDir, { recursive: true, force: true })
    } catch (error) {
        // do nothing
    } finally {
        await fs.mkdir(outDir)
    }
}

const copyAndCreatePackageJSON = async () => {
    fs.copyFile(path.resolve(__dirname, '../package.json'), path.resolve(__dirname, '../dist/package.json'))
    fs.writeFile(path.join(cjsOutDir, './package.json'), cjsPackageJsonContent)
    fs.writeFile(path.join(emsOutDir, './package.json'), esmPackageJsonContent)
}

const buildCommonJs = async () =>
    build({
        ...options,
        format: 'cjs',
        outdir: cjsOutDir
    })

const buildESM = async () =>
    build({
        ...options,
        format: 'esm',
        outdir: emsOutDir
    })

const run = async () => {
    try {
        await prepareOutDir()
        await Promise.all([buildCommonJs(), buildESM()])
        await copyAndCreatePackageJSON()
    } catch (error) {
        console.error(error)
    }
}

run()
