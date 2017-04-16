import { FilePath } from "../index";
/**
 * @property {String} out - output file path. This module assumes execution in aws lambda environment.
 *      The passed in pdf file should be a unique s3 file name (key). If it is not this file could
 *      potentially be over-written be a subsequent call.
 */
export declare class FillForm {
    fdf: FilePath;
    pdf: FilePath;
    out: FilePath;
    options: Array<string>;
    constructor(fdfFilePath: string, pdfFilePath: string, options?: Array<string>, outfile?: string);
    private static _validateConstructor(pdfFilePath, options);
    write(): Promise<string>;
}
