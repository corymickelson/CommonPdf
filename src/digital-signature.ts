import { FilePath } from "commonpdf";
import { exec } from "child_process";
import { join } from "path";

export type SigningOptions = { location: string, reason: string, passwd: string }
/**
 * @desc Secure Pdf with digital signature.
 *      This class uses PortableSigner and requires java is installed on your path
 *
 *      FilePaths must be absolute.
 */
export class DigitalSignature {
	constructor( public pdf: FilePath,
	             public cert: FilePath,
	             public signOpts: SigningOptions,
	             public outfile: FilePath ) {
	}

	async write(): Promise<FilePath> {
		let executable = `java -jar PortableSigner.jar -n`,
			desc = `-l '${this.signOpts.location}' -r '${this.signOpts.reason}'`,
			command = `${executable} -t ${this.pdf} -o ${this.outfile} -s ${this.cert} -p ${this.signOpts.passwd} ${desc}`,
			execCommand = `cd ${join(__dirname, '../bin')} && ${command}`

		await new Promise( ( resolve, reject ) => {
			exec(execCommand , ( err: Error, stderr: string, stdout: string ) => {
				err ? reject( err ) : resolve( stdout )
			} )
		} )

		return this.outfile
	}
}

export function future<T>( fn: Function, args: Array<any> ): Promise<T> {
	return new Promise( ( resolve, reject ) => {
		try {
			let result = fn.apply( this, args )
			resolve( result )
		}
		catch ( e ) {
			reject( e )
		}
	} )
}
