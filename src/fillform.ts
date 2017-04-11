'use strict'
import {existsSync} from 'fs'
import {join} from 'path'
import {exec} from 'child_process'
import {v4 as id} from 'uuid'
import { FilePath } from "commonpdf";


/**
 * @property {String} out - output file path. This module assums execution in aws lambda environment.
 *      The passed in pdf file should be a unique s3 file name (key). If it is not this file could
 *      potentially be over-written be a subsequent call.
 */
export class FillForm {
	public fdf:FilePath
	public pdf:FilePath
	public out:FilePath
	public options:Array<string>

	constructor( fdfFilePath:string, pdfFilePath:string, options:Array<string> = [], outfile?:string ) {
		FillForm._validateConstructor(pdfFilePath, options)
		this.fdf = fdfFilePath
		this.pdf = pdfFilePath.substr( 0, 4 ) === '/tmp' ? pdfFilePath : join( __dirname, pdfFilePath )
		this.out = `/tmp/${outfile || id()}.pdf`
		this.options = options || []
	}

	private static _validateConstructor(pdfFilePath:string, options:Array<string>) {
		if(!existsSync( pdfFilePath.substr( 0, 4 ) === '/tmp' ? pdfFilePath : join( __dirname, pdfFilePath ) ))
			throw Error('Pdf file not found')
		if(!Array.isArray(options)) throw Error("options must be an array")
	}

	write():Promise<string> {
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
