import { FilePath } from "commonpdf";
import { v4 as id } from 'uuid'
import { join } from "path";
import { existsSync } from "fs";
import { exec } from "child_process";
/**
 * Created by skyslope on 4/12/17.
 */

export class Fix {
	public out: FilePath

	constructor( public pdf: FilePath, outfile?: FilePath ) {
		Fix._validateConstructor( pdf )
		this.out = (outfile && outfile.substr( 0, 4 ) === '/tmp') ? outfile : `/tmp/${outfile || id()}.pdf`
	}

	private static _validateConstructor( pdfFilePath: FilePath ) {
		if ( !existsSync( pdfFilePath.substr( 0, 4 ) === '/tmp' ? pdfFilePath : join( __dirname, pdfFilePath ) ) )
			throw Error( 'Pdf file not found' )
	}

	write(): Promise<string> {
		return new Promise( ( fulfill, reject ) => {
			exec( `pdftk ${this.pdf} output ${this.out}`, ( err, stderr, stdout ) => {
				err ? reject( err ) : fulfill( this.out )
			} )
		} )
	}
}
