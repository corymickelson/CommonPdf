import { FilePath } from "commonpdf";
import { CommonPdfOptionalSignature } from "./digital-signature";
export declare class Concat {
    docs: Array<FilePath>;
    options: Array<{
        start: number;
        end: number | string;
    }>;
    signOpts: CommonPdfOptionalSignature;
    out: string;
    signInline: boolean;
    password: string;
    postProcessSigning: boolean;
    constructor(docs: Array<FilePath>, options?: Array<{
        start: number;
        end: number | string;
    }>, signOpts?: CommonPdfOptionalSignature, outfile?: FilePath);
    write(): Promise<FilePath>;
}
