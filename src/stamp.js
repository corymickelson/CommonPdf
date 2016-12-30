/**
 * Created by cory on 12/30/16.
 */
const exec = require('child_process').exec,
	pdfkit = require('pdfkit'),
	pdf2Json = require('pdf2json')


class Stamp {

	/**
	 *
	 * @param {String} base - pdf file path
	 * @param {String} image - signature image file path
	 */
	constructor(base, image) {

	}

	/**
	 * @desc parse pdf for signature blocks, return block json positioning
	 * @returns {Promise} - empty promise
	 */
	position() {
		return new Promise((fulfill, reject) => {})
	}

	/**
	 * @desc generate a new transparent pdf with the image placed according to json output.
	 * @returns {Promise} - empty promise
	 */
	overlay() {
		return new Promise((fulfill, reject) => {})
	}

	/**
	 * @desc stamp base pdf with overlay
	 * @returns {Promise<String>} - file path of output pdf
	 */
	apply() {
		return new Promise((fulfill, reject) => {})
	}
}
