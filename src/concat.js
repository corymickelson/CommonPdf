/**
 * Created by cory on 12/29/16.
 */
const fs = require( 'fs' ),
	exec = require( 'child_process' ).exec,
	path = require( 'path' )

class Concat {
	/**
	 *
	 * @param {Array<String>} docs
	 */
	constructor( ...docs ) {
		this.docs = docs.map( doc => {
			return doc
		} )
		this.out = '/tmp/out.pdf'
	}

	/**
	 *
	 * @returns {Promise<String>} - out file path
	 */
	write() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.docs.join( ' ' )} cat output ${this.out}`
			exec( command, ( error, stdout, stderr ) => {
				if( error || stderr ) reject( error )
				else fulfill( this.out )
			} )
		} )
	}
}

module.exports.Concat = Concat
