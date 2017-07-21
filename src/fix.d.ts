import { FilePath } from "../index";
/**
 * Created by skyslope on 4/12/17.
 */
export declare class Fix {
    pdf: FilePath;
    out: FilePath;
    constructor(pdf: FilePath, outfile?: FilePath);
    private static _validateConstructor(pdfFilePath);
    write(): Promise<string>;
}
