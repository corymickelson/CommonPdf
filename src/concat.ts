/**
 * Created by cory on 12/29/16.
 */
'use strict'

import { exec } from 'child_process'
import { v4 as id } from 'uuid'
import { FilePath } from "commonpdf";
import * as fs from "fs";
import {
	CommonPdfOptionalSignature, DigitalSignature, DigitalSignatureOption,
	SigningOptions
} from "./digital-signature";


export class Concat {
	public out: string
	public signInline: boolean = false
	public password: string
	public postProcessSigning: boolean = false

	constructor( public docs: Array<FilePath>,
	             public options?: Array<{ start: number, end: number | string }>,
	             public signOpts?: CommonPdfOptionalSignature,
	             outfile?: FilePath ) {

		this.docs = docs.map( doc => {
			if ( !fs.existsSync( doc ) ) throw new Error( `File not found ${doc}` )
			return doc
		} )

		if ( Array.isArray( options ) && options.length > 0 ) {
			this.options = options.reduce( ( accum, item, index ) => {
				accum.push( [ `${item.start}${!item.end ? '' : '-'}${item.end || '' }` ] )
				return accum
			}, [] )
		} else this.options = []

		if ( this.docs.length > 1 && this.options.length > 0 )
			throw new Error( 'Can not concat and split. Try, concatenating first, and splitting afterwards.' )

		this.out = (outfile && outfile.substr( 0, 4 ) === '/tmp') ? outfile : `/tmp/${outfile || id()}.pdf`

		if ( signOpts ) {
			if ( signOpts.encrypt === DigitalSignatureOption.Inline ) {
				this.signInline = true
				this.password = signOpts.config.options.passwd
			}
			else {
				this.postProcessSigning = true
			}
		}
	}

	async write(): Promise<FilePath> {
		let secure = this.signInline ? `owner_pw ${this.password}` : '',
			output = this.postProcessSigning ? `${this.out.substr( 0, this.out.length - 4 )}.unsigned.pdf` : this.out,
			command = `pdftk ${this.docs.join( ' ' )} cat ${this.options.join( " " )} output ${output} ${secure}`

		await new Promise( ( fulfill, reject ) => {
			exec( command, { shell: '/bin/sh' }, ( error, stdout, stderr ) => {
				error || stderr ? reject( error ) : fulfill( output )
			} )
		} )

		if ( this.postProcessSigning ) {
			await new DigitalSignature( output , this.signOpts.config.certificate, this.signOpts.config.options, this.out )
				.write()
		}

		return this.out
	}
}

