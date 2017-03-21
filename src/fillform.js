'use strict'
const fs = require( 'fs' ),
	exec = require( 'child_process' ).exec,
	join = require( 'path' ).join,
	id = require( 'uuid' ).v4

/**
 * @property {String} out - output file path. This module assums execution in aws lambda environment.
 *      The passed in pdf file should be a unique s3 file name (key). If it is not this file could
 *      potentially be over-written be a subsequent call.
 */
class FillForm {
	/**
	 * @param {String} fdfFilePath - fdf file path
	 * @param {String} pdfFilePath - pdf file path
	 * @param {String} [outfile] - output file path
	 * @param {Array} [options] - Available options: flatten, more to come....
	 * @todo Add check that files exist
	 */
	constructor( fdfFilePath, pdfFilePath, options, outfile ) {
		this.fdf = fdfFilePath
		//this.pdf = pdfFilePath.substr( 0, 4 ) === '/tmp' ? join( __dirname, pdfFilePath )
		this.pdf = fs.existsSync( pdfFilePath.substr( 0, 4 ) === '/tmp' ? pdfFilePath : join( __dirname, pdfFilePath ) ) ? //eslint-disable-line
			pdfFilePath.substr( 0, 4 ) === '/tmp' ? pdfFilePath : join( __dirname, pdfFilePath ) :
			new Error( 'pdf file not found' )
		this.out = `/tmp/${outfile || id()}.pdf`
		if( options && !Array.isArray( options ) ) throw new Error( 'Options must be in Array format' )
		this.options = options || []
	}

	/**
	 *
	 * @returns {Promise<String>} - filled pdf file path
	 */
	write() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.pdf} fill_form ${this.fdf} output ${this.out} ${
				this.options.join( " " ).toLowerCase()}`
			exec( command, { shell: '/bin/sh' },
				( error, stdout, stderr ) => {
					if( error || stderr ) reject( error )
					else fulfill( this.out )
				} )
		} )
	}
}

module.exports.FillForm = FillForm
