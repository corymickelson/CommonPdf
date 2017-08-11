import {join} from 'path'
import {existsSync, readdir} from 'fs'

async function findCommonPdfBinaries(): Promise<boolean> {
    const commonPdfBinaryModules = ['CommonPdf_PoDoFo', 'CommonPdf_Pdftk'],
        nodeModulesPath = join(__dirname, '../node_modules')
    if (!existsSync(nodeModulesPath)) {
        throw Error('node modules directory not found... please run \`npm install`\ and try again.')
    }
    return new Promise<boolean>((fulfill: Function, reject: Function) => {
        readdir(nodeModulesPath, ((err, files) => {
            if (err) reject(err)
            return commonPdfBinaryModules.every(m => files.includes(m));
        }))
    })
}

export async function setup(): Promise<void> {
    //const check = await findCommonPdfBinaries()
    //if (!check) throw Error('CommonPdf binaries not found!')
    const commonPdfPodofo = `${process.env['LAMBDA_TASK_ROOT']}/node_modules/commonpdf_podofo`
    const commonPdfPdftk = `${process.env['LAMBDA_TASK_ROOT']}/node_modules/commonpdf_pdftk`
    process.env['PATH'] = `${process.env['PATH']}:${commonPdfPdftk}:${commonPdfPodofo}`
    process.env['LD_LIBRARY_PATH'] = `${commonPdfPodofo}:${commonPdfPdftk}`
}
