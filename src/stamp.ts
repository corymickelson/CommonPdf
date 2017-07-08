/**
 * Created by cory on 12/30/16.
 */
'use strict'
import {exec} from 'child_process'
import {v4 as id} from 'uuid'
import {Concat} from './concat'
import {FilePath} from "../index";
import {createWriteStream, linkSync, unlink} from "fs";
import * as Pdf from 'pdfkit'
import {PDFDocument} from 'pdfkit'
import {basename} from "path";


export type FontOpts = { color: string | [number, number, number], family: string }
export type LinkOpts = { text: string, x: number, y: number, link: string, options?: { [key: string]: string } }
export type ImgOpts = { x: number, y: number, width: number, height: number, uri: string }
/**
 * @desc Given a position and dimensions add the provided image to the provided pdf
 *
 * @class Stamp
 * @property {String} pdf
 * @property {String} image
 * @property {{x:Number, y:Number}} coordinates
 * @property {{width:Number, height:Number}} dimensions
 */
export class Stamp {
    public target: string
    public out: FilePath

    /**
     *
     * @param {String} pdf - pdf file path
     * @param {String} [outfile] - out put file location. Defaults to /tmp
     */
    constructor(public pdf: FilePath, outfile?: FilePath) {
        this.pdf = pdf
        this.target = null
        this.out = (outfile && outfile.substr(0, 4) === '/tmp') ? outfile : `/tmp/${outfile || id()}.pdf`
    }

    /**
     * @desc Generates a new pdf with image at the provided coordinates and dimensions
     * @param {{x:Number, y:Number, width:Number, height:Number}} imgs -
     * @return {Promise<String>} -
     */
    _stamp(imgs: Array<ImgOpts>): Promise<string> {
        return new Promise((fulfill, reject) => {
            let out = `/tmp/${id()}.pdf`,
                placeholderStampPdf = `/tmp/${id()}.pdf`,
                tmpPdf = new Pdf()
            imgs.forEach(({uri, height, width, x, y}) => {
                tmpPdf.image(uri, x, y, {width, height})
            })
            tmpPdf.pipe(createWriteStream(out))
            tmpPdf.end()
            exec(`pdftk ${this.target} stamp ${out} output ${placeholderStampPdf}`, (error, stdout, stderr) => {
                if (error || stderr) reject(error)
                else fulfill(placeholderStampPdf)
            })
        })
    }

    static createLink(link: LinkOpts, opt?: FontOpts): Promise<{doc:PDFDocument, out: FilePath}> {
        return new Promise((fulfill, reject) => {
            const linkDocument = new Pdf(),
                outLink = `/tmp/${id()}-link.pdf`
            linkDocument.pipe(createWriteStream(outLink))
            if (opt) {
                // set font
            }
            linkDocument.text(link.text, link.x, link.y, {link: link.link})
            fulfill({doc: linkDocument, out: outLink})
        })
    }


    /**
     *
     * @param sources if multi stamp this is a multi PAGE pdf where each page is stamped to the target pdf
     * @returns {Promise<string>} - out file path
     */
    multiStamp(sources: FilePath): Promise<string> {
        return new Promise((fulfill, reject) => {
            let out = `/tmp/${id()}.pdf`
            exec(`pdftk ${this.target} multistamp ${sources} output ${out}`,
                (err, stdout, stderr) => {
                    (err || stderr) ? reject(err) : fulfill(out)
                })
        })
    }

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
    _burst(): Promise<string> {
        return new Promise((fulfill, reject) => {
            let documentId = basename(this.pdf, '.pdf')
            let command = `pdftk ${this.pdf} burst output /tmp/${documentId}-pg_%d.pdf && find /tmp -name "${documentId}-pg_*.pdf"`
            exec(command, (error, stdin, stderr) => {
                fulfill(stdin.split('\n')
                    .filter(x => x.length > 0))
            })
        })
    }

    /**
     * @desc Write new pdf with image stamp.
     * @todo: Use pdftk multi-stamp instead of stamp
     * @param {Number} page - page index to apply image
     * @param {{width:Number, height:Number, x:Number, y:Number}} srcs - stamp positioning
     * @returns {Promise<String>} - output file location
     */
    write(page: number, srcs: Array<ImgOpts>): Promise<string> {
        let pages;
        return new Promise((fulfill, reject) => {
            if (!page || typeof page !== 'number') reject('Page number required.')
            this._burst()
                .then(burstPages => {
                    pages = burstPages
                    let pageString = `pg_${page}.pdf`
                    this.target = pages.find(x => x.indexOf(pageString) !== -1)
                    return Promise.resolve()
                })
                .then(() => {
                    return this._stamp(srcs)
                })
                .then(stampedPage => {
                    return new Concat(pages.reduce((accum, item, index) => {
                        let pageIndex = Stamp.pageIndex(item),
                            targetIndex = Stamp.pageIndex(this.target)
                        accum[pageIndex] = pageIndex === targetIndex ? stampedPage : item
                        return accum
                    }, []), null, null, this.out).write()
                })
                .then(final => {
                    Promise.all(pages.map(p => unlink(p, err => {
                        if (err) reject(err)
                        return Promise.resolve()
                    })))
                        .then(_ => {
                            fulfill(final)
                        })
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    static pageIndex(page: string): number {
        let subject = page.split("_")[1]
        return parseInt(subject) - 1
    }

}
