import { FilePath } from "../index";
export declare type ImgOpts = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * @desc Given a position and dimensions add the provided image to the provided pdf
 *
 * @class Stamp
 * @borrows PDFDocument
 * @property {String} pdf
 * @property {String} image
 * @property {{x:Number, y:Number}} coordinates
 * @property {{width:Number, height:Number}} dimensions
 */
export declare class Stamp {
    pdf: FilePath;
    target: string;
    out: FilePath;
    /**
     *
     * @param {String} pdf - pdf file path
     * @param {String} [outfile] - out put file location. Defaults to /tmp
     */
    constructor(pdf: FilePath, outfile: FilePath);
    /**
     * @desc Generates a new pdf with image at the provided coordinates and dimensions
     * @param {String} img - data url
     * @param {{x:Number, y:Number, width:Number, height:Number}} opts -
     * @return {Promise<String>} -
     */
    _stamp(img: string, opts: ImgOpts): Promise<string>;
    /**
     * @desc Burst file into individual pages.
     *       Files written to /tmp with documentId prefix
     *
     * @returns {Promise}
     * @private
     *
     * @todo: The find operation will return an error for any file without x permission in /tmp directory
     *        the current work around is to ignore stderr in this process.
     *        Trying to grep filter 'Permission denied' has not yet worked.
     */
    _burst(): Promise<string>;
    /**
     * @desc Write new pdf with image stamp.
     *
     * @param {String} img - data uri
     * @param {Number} page - page index to apply image
     * @param {{width:Number, height:Number, x:Number, y:Number}} opts - stamp positioning
     * @returns {Promise<String>} - output file location
     */
    write(img: string, page: number, opts: ImgOpts): Promise<string>;
    static pageIndex(page: string): number;
}
