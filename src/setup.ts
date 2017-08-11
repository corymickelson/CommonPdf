export function setup() {
	const commonPdfPodofo = `${process.env[ 'LAMBDA_TASK_ROOT' ]}/node_modules/commonpdf_podofo`
	const commonPdfPdftk = `${process.env[ 'LAMBDA_TASK_ROOT' ]}/node_modules/commonpdf_pdftk`
	process.env[ 'PATH' ] = `${process.env[ 'PATH' ]}:${commonPdfPdftk}:${commonPdfPodofo}`
	process.env[ 'LD_LIBRARY_PATH' ] = `${commonPdfPodofo}:${commonPdfPdftk}`
}
