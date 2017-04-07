import { exists, unlink } from "fs";
import { DigitalSignature } from "./digital-signature";
import * as test from 'tape'
import { join } from "path";
/**
 * Created by skyslope on 4/6/17.
 */

process.env.SPEC = true

test( 'Digital signature', t => {
	t.plan( 1 )
	let outfile = '/tmp/digitalSignatureSpec.pdf'
	const Subject = new DigitalSignature( join( __dirname, '../test-data/fw9.pdf' ),
		join( __dirname, '../test-data/test-cert.pfx' ),
		{
			location: '825 K Street Sacramento CA',
			reason: 'SkySlope',
			passwd: '123456'
		},
		outfile )
	Subject.write()
		.then( ( x: string ) => {
			return exists( x, exists => {
				t.true( exists )
			} )
		} )
		.then( () => {
			unlink( outfile, ( err: Error ) => {
				if(err) console.log( 'failed to clean up test file' )
			} )
		} )
} )


