/**
 * Created by cory on 12/29/16.
 */
const exec = require('child_process').exec

class Rotate {
	/**
	 *
	 * @param {Array<{file:String, page:Number, effect:String}>} source
	 * @param {Array} opts
	 */
	constructor(source, opts) {
		this.out = opts.find(x => Object.keys(x).includes('out')) ?
			opts['out'] :
			'/tmp/out.pdf'
	}

	write() {}
}
