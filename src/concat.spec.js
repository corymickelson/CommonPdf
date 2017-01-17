/**
 * Created by cory on 1/13/17.
 */
const test = require( 'tape' ),
	fs = require( 'fs' ),
	join = require( 'path' ).join,
	exec = require( 'child_process' ).exec,
	Subject = require( './concat' ).Concat


test( 'Concat', t => {
	new Subject( [ join( __dirname, '../test-data/IntelliJIDEA_ReferenceCard.pdf' ), join( __dirname, '../test-data/keyboard-shortcuts-linux.pdf' ), join( __dirname, '../test-data/fw9.pdf' ) ] )
		.write()
		.then( outFile => {
			t.plan( 1 )
			exec( `pdftk ${outFile} dump_data | grep -i NumberOfPages`, ( error, stdin, stderr ) => {
				if( error || stderr ) t.fail()
				else {
					t.equal( stdin[ stdin.indexOf( ':' ) + 2 ], '6' )
				}
			} )
		} )
		.catch( e => {
			t.fail()
		} )
} )

