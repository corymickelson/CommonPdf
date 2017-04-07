/**
 * Created by skyslope on 4/7/17.
 */

export function setup() {
	process.env[ 'PATH' ] = process.env[ 'PATH' ] + ':' + process.env[ 'LAMBDA_TASK_ROOT' ] + '/bin'
	process.env[ 'LD_LIBRARY_PATH' ] = process.env[ 'LAMBDA_TASK_ROOT' ] + '/bin'
}
