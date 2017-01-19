'use strict'
const exec = require( 'child_process' ).exec,
	join = require( 'path' ).join,
	fs = require( 'fs' )

class FDFGenerator {
	/**
	 * @param {String} pdf - pdf file
	 * @param {Array<{fieldname:String, fieldvalue:String}>} values - value map
	 */
	constructor( pdf, values ) {
		this.header = '%FDF-1.2\n 1 0 obj<</FDF<< /Fields['
		this.footer = '] >> >>\n endobj\n trailer\n <</Root 1 0 R>>\n %%EOF'
		this.pdf = !fs.existsSync( join( __dirname, pdf ) ) ? //eslint-disable-line
			new Error( 'pdf file not found' ) :
			join(__dirname, pdf)
		this.values = values.length === 0 ?
			new Error( 'values must not be null' ) :
			values
	}

	write() {
		return new Promise( ( fulfill, reject ) => {
			this._checkAg()
				.then( ag => {
					this.grep = ag ? 'ag' : 'grep'
					return this._validate()
				} )
				.then( obj => {
					this.pdfData = obj
					return this._assignments( this.values )
				} )
				.then( body => {
					return this._write( body )
				} )
				.then( file => {
					fulfill( file )
				} )
				.catch( e => reject( e ) )
		} )
	}

	_validate() {
		return new Promise( ( fulfill, reject ) => {
			FDFGenerator._extractFieldNames(this.pdf)
				.then( titles => {
					if(!this.values.every(x => titles.find(t => t.FieldName === x.fieldname))) reject( new Error( 'mismatched field name mapping' ) )
					fulfill(titles)
				} )

		} )
	}

	/**
	 * @param {Array<{fieldname:String, fieldvalue:String}>} fdfMap - field name / value map
	 * @returns {Promise<String>} - tmp file fdf
	 */
	_write( fdfMap ) {
		return new Promise( ( fulfill, reject ) => {
			let lines = [this.header]
			fdfMap.forEach(f => {
				let line = 	FDFGenerator._fieldWriter(f)
				lines.push(line)
			})
			lines.push(this.footer)
			fs.writeFile( '/tmp/fillform.fdf', /*[ this.header, ...fdfMap.map( f => FDFGenerator._fieldWriter( f ) ), this.footer ]*/ lines.join( '\n' ),
				err => {
					if( err ) reject( err )
					else fulfill( '/tmp/fillform.fdf' )
				} )
		} )
	}

	/**
	 * @desc  Format field / value for fdf file
	 * @returns {string} - format for fdf file
	 * @private
	 * @param {{fieldname:String, fieldvalue:String}}field
	 */
	static _fieldWriter( field ) {
		return `<< /T (${field.fieldname}) /V (${field.fieldvalue}) >>`
	}

	_checkAg() {
		return new Promise( fulfill => {
			exec( 'ag -h', ( error, stdout, stderr ) => {
				if( error || stderr ) fulfill( false )
				else fulfill( true )
			} )
		} )

	}

	/**
	 * @param {String} pdf - pdf file path
	 * @returns {Promise<Array>} - field dump file path
	 */
	static _extractFieldNames(pdf) {
		return new Promise( ( fulfill, reject ) => {
			exec( `pdftk ${pdf} dump_data_fields`, ( err, stdout, stderr ) => {
				if( err ) reject( err )
				fulfill( stdout.split( '---' )
					.filter( i => i.length > 3 )
					.reduce( ( accum, item, index ) => {
						let field = {},
							line = item.split( '\n' )
								.filter( i => i.length > 1 ),
							name = line.map( i => i.substr( 0, i.indexOf( ':' ) ) ),
							value = line.map( i => i.substr( i.indexOf( ':' ) + 2 ) )
						name.forEach( ( p, i ) => {
							if( !field.hasOwnProperty( p ) ) field[ p ] = value[ i ]
						} )
						if( field[ 'FieldType' ].trim().length === 0 ) return accum
						else {
							accum.push( field )
							return accum
						}
					}, [] ) )
			} )
		} )
	}

	/**
	 * @param {Array<{fieldname:String, fieldvalue:String}>} fields - values from client
	 * @returns {Promise<Array<{fieldname:String, fieldvalue:String}>>} - file path to FDF file
	 */
	_assignments( fields ) {
		return new Promise( ( fulfill, reject ) => {
			fulfill(fields.reduce((accum, field, index) => {
				let dataField = this.pdfData.find( x => x[ 'FieldName' ] === field.fieldname ),
					writeValue = field.fieldvalue
				if(dataField.hasOwnProperty( 'FieldStateOption' )) {
					writeValue = field.fieldvalue ? dataField[ 'FieldStateOption' ] : 0
				}
				accum.push({fieldname: dataField[ 'FieldName'], fieldvalue: writeValue})
				return accum
				// return [{fieldname: dataField[ 'FieldName'], fieldvalue: writeValue}, ...accum]
			}, []))
		} )
	}
}

module.exports.FDFGenerator = FDFGenerator
module.exports.PdfData = FDFGenerator._extractFieldNames