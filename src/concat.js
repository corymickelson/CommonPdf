/**
 * Created by cory on 12/29/16.
 */
const fs = require( 'fs' ),
	exec = require( 'child_process' ).exec,
	join = require('path').join

/**
 * @class Concat
 */
class Concat {
	/**
	 *
	 * @param {Array<String>} docs - document file paths
	 * @param {String} outfile - out file path
	 */
	constructor( docs, outfile = '/tmp/out.pdf' ) {
		this.docs = docs.map( doc => {
			if(!fs.existsSync(doc)) throw new Error(`File not found ${doc}`)
			return doc
		} )
		this.out = outfile || '/tmp/out.pdf'
	}

	/**
	 *
	 * @returns {Promise<String>} - out file path
	 */
	write() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.docs.join( ' ' )} cat output ${this.out}`
			exec( command, ( error, stdout, stderr ) => {
				error || stderr ? reject(error) : fulfill(this.out)
			} )
		} )
	}
}

module.exports.Concat = Concat
