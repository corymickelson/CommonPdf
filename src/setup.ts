import { exec } from "child_process";
/**
 * Created by skyslope on 4/7/17.
 */

function wrap( command ): Promise<any> {
	return new Promise( ( fulfill, reject ) => {
		exec( command, ( err, stderr, stdout ) => {
			err ? reject( err ) : fulfill( stdout )
		} )
	} )
}
export async function setup():Promise<void|Error> {
	Promise.all( [] )
		.then( _ => {
			process.env[ 'PATH' ] = `${process.env[ 'PATH' ]}:${process.env[ 'LAMBDA_TASK_ROOT' ]}/bin:${process.env[ 'LAMBDA_TASK_ROOT' ]}/node_modules/commonpdf/bin`
			process.env[ 'LD_LIBRARY_PATH' ] = `${process.env[ 'LAMBDA_TASK_ROOT' ]}/bin:${process.env[ 'LAMBDA_TASK_ROOT' ]}/node_modules/commonpdf/bin`
		} )
		.catch( e => {
			throw e
		} )

}
