import { FilePath } from "../index";
export declare class Rotate {
    source: FilePath;
    target: number;
    direction: string;
    out: FilePath;
    constructor(source: FilePath, target: number, opts: {
        direction: string;
    }, outfile?: FilePath);
    /**
     *
     * @param {Number} target - target page
     * @returns {Promise<String>} - a substring of the rotation command
     * @private
     */
    _cat(target: number): Promise<string>;
    /**
     *
     * @returns {Promise<String>} - output pdf path
     */
    write(): Promise<string>;
}
