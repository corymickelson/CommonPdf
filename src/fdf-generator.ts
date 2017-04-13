'use strict'
import { join } from "path";
import { existsSync, writeFile } from 'fs'
import { v4 as id } from 'uuid'
import { exec } from 'child_process'
import { FilePath } from "commonpdf";

export type FDFField = { fieldname: string, fieldvalue: string | number }
export type FDFFieldsMap = Array<FDFField>
export type FieldAnnotations = {
	FieldType?: string,
	FieldName?: string,
	FieldFlags?: number,
	FieldJustification?: string,
	FieldStateOption?: string | number,
	FieldMaxLength?: number
}
export class FDFGenerator {
	public pdf: string
	public out: string
	public grep: string
	public pdfData: [ FieldAnnotations ]
	public header: string = '%FDF-1.2\n 1 0 obj<</FDF<< /Fields['
	public footer: string = '] >> >>\n endobj\n trailer\n <</Root 1 0 R>>\n %%EOF'

	constructor( pdf: FilePath, public values: FDFFieldsMap ) {
		FDFGenerator._constructorValidations( pdf, values )
		this.pdf = pdf.substr( 0, 4 ) === '/tmp' ? pdf : join( __dirname, pdf )
		this.values = values
		this.out = `/tmp/${id()}.fdf`
	}

	private static _constructorValidations( pdf: string, values: FDFFieldsMap ) {
		if ( typeof pdf !== 'string' || !Array.isArray( values ) ) throw new TypeError()
		if ( !existsSync( pdf.substr( 0, 4 ) === '/tmp' ? pdf : join( __dirname, pdf ) ) ) {
			throw new Error( 'pdf file not found' )
		}
		if ( !values ) {
			throw new Error( 'values must not be null' )
		}
	}

	async write(): Promise<FilePath> {
		try {
			let searchUtil = await this._checkAg()
			this.grep = searchUtil ? 'ag' : 'grep'

			this.pdfData = await this._validate()

			let body = this._assignments( this.values )
			return await this._write( body )
		}
		catch ( e ) {
			throw e
		}

	}

	async _validate(): Promise<[ FieldAnnotations ]> {
		let titles = await FDFGenerator._extractFieldNames( this.pdf )

		if ( !this.values.every( v => titles.find( t => t.FieldName === v.fieldname ) !== undefined ) ) {
			throw new Error( 'mismatched field name mapping' )
		}
		else return titles
	}

	private _write( fdfMap: FDFFieldsMap ): Promise<FilePath> {
		let lines = [ this.header, ...fdfMap.map( f => FDFGenerator._fieldWriter( f ) ), this.footer ].join( '\n')
		return new Promise<string>( ( fulfill, reject ) => {
			writeFile( this.out, lines,
				'utf8',
				err => {
					err ? reject( err ) : fulfill( this.out )
				} )
		} )
	}

	private static _fieldWriter( field ) {
		return `<< /T (${field.fieldname}) /V (${field.fieldvalue}) >>`
	}

	private _checkAg(): Promise<boolean> {
		return new Promise( fulfill => {
			exec( 'ag -h', { shell: '/bin/sh' }, ( error, stdout, stderr ) => {
				if ( error || stderr ) fulfill( false )
				else fulfill( true )
			} )
		} )

	}

	static _extractFieldNames( pdf: string ): Promise<[ FieldAnnotations ]> {
		return new Promise( ( fulfill, reject ) => {
			exec( `pdftk ${pdf} dump_data_fields`, { shell: '/bin/sh' }, ( err, stdout, stderr ) => {
				if ( err ) reject( err )
				if ( stdout === '' ) fulfill( [] )
				fulfill( stdout.split( '---' )
					.filter( i => i.length > 3 )
					.reduce( ( accum, item, index ) => {
						let field: FieldAnnotations = {},
							line = item.split( '\n' )
								.filter( i => i.length > 1 ),
							name = line.map( i => i.substr( 0, i.indexOf( ':' ) ) ),
							value = line.map( i => i.substr( i.indexOf( ':' ) + 2 ) )
						name.forEach( ( p, i ) => {
							if ( !field.hasOwnProperty( p ) ) field[ p ] = value[ i ]
						} )
						if ( field[ 'FieldType' ].trim().length === 0 ) return accum
						else {
							accum.push( field )
							return accum
						}
					}, [] ) )
			} )
		} )
	}

	private _assignments( fields: FDFFieldsMap ): FDFFieldsMap {
		return fields.reduce<FDFFieldsMap>( ( accum, field, index ) => {
			let dataField = this.pdfData.find( x => x[ 'FieldName' ] === field.fieldname ),
				writeValue = field.fieldvalue
			if ( dataField.hasOwnProperty( 'FieldStateOption' ) ) {
				writeValue = field.fieldvalue ? dataField[ 'FieldStateOption' ] : 0
			}
			return [ { fieldname: dataField[ 'FieldName' ], fieldvalue: writeValue }, ...accum ]
		}, [] )
	}
}

export const PdfData = FDFGenerator._extractFieldNames
