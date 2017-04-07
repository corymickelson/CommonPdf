/**
 * Created by cory on 12/29/16.
 */
'use strict'

import { exec } from 'child_process'
import { v4 as id } from 'uuid'
import { FilePath } from "commonpdf";
import * as fs from "fs";
import { SigningOptions } from "./digital-signature";

export type DigitalSignaturePostParams = {
	certificate: FilePath,
	options: SigningOptions
}
export enum DigitalSignatureOption {
	Post,
	Inline
}
export type CommonPdfOptionalSignature = {
	encrypt: DigitalSignatureOption,
	config: DigitalSignaturePostParams
}
class Concat {
	public out: string
	public signInline: boolean = false
	public password:string
	public postProcessSigning:boolean = false

	constructor( public docs: Array<FilePath>,
	             public options?: Array<{ start: number, end: number }>,
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

		if(signOpts) {
			if(signOpts.encrypt === DigitalSignatureOption.Inline) {
				this.password = signOpts.config.options.passwd
			}
			else {

			}
		}
	}

	async write(): Promise<FilePath> {
		await new Promise( ( fulfill, reject ) => {
			let secure = this.signInline ? `owner_pw ${this.password}` : '',
				command = `pdftk ${this.docs.join( ' ' )} cat ${this.options.join( " " )} output ${this.out} ${secure}`
			exec( command, { shell: '/bin/sh' }, ( error, stdout, stderr ) => {
				error || stderr ? reject( error ) : fulfill( this.out )
			} )
		} )
		if(this.postProcessSigning) {
			
		}
		else return this.out
	}
}

module.exports.Concat = Concat
