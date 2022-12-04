import express from 'express';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

import { writeFile, readFile, unlink } from 'fs/promises';
import { PDFDocument } from 'pdf-lib'
import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import {fromBuffer} from 'pdf2pic';

// import { play } from '@anggamanggala21/text-to-speech';
// const { play } = pkg;

const router = express.Router();
// router.get('/', async (req, res) => {

// })
let conversion = []
router.get('/', (req, res)=>{
    ((req.query.page-1) >= 0 || (req.query.page-1) >= conversion.length ) ? res.send(conversion[req.query.page-1]) : res.send("page out of bound")
    
})


router.post('/', async (req, res) => {
    const { pdf } = req.files;
    const split_pdf = await newPdfBytes(await PDFDocument.load(pdf.data))
    // pdf.mv(`./pdf/${pdf.name}`);
    const png = []
    
    const options = {
        quality: 100,
        density: 200,
        saveFilename: "test2",
        savePath: "./images",
        format: "png",
        compression: "None",
        width: split_pdf[2]*3,
        height: split_pdf[3]*3
    };
    
    const image = fromBuffer(split_pdf[0], options)
    const worker = await createWorker({
        logger: m => console.log(m)
    });

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // await worker.recognize(image);
    for (let i = 1; i <= split_pdf[1]; i++) {
        let p1 = await image(i)
        png.push(p1.path)
        const { data: { text } } = await worker.recognize(await readFile(p1.path));
        conversion.push(text)
    }
    await worker.terminate();
    // const text = `
    // The Power of Technology

    // Our inventions change the world, and the reinvented world changes us. Human life on Earth today looks radically different from just a century ago, thanks in good part to technologies invented in the intervening years. Once firmly earthbound, with only legs and wheels to carry us on land and ships to cross the waters, we have now taken to flight in droves, with more than eight million passengers criss-crossing continents each day in a few airborne hours. If Rich-ard Branson, found of Virgin Galactic, achieves his dream of building the world's first commercial "spaceline," ordinary people may soon become astronauts. Communication, too, has broken free from shackles of time and distance. When I left India in the mid-1950s, it took three weeks for letters to go back and forth from Kolkata, where I was born, to Scarsdale, New York, where my family first settled. Mail would not arrive reliably. Stamps would be stolen and packages not delivered. Today, an electronic message sent at night from the eastern United States brings an instant reply from a friend in Europe or Asia whose day is just beginning. Facebook connects more than a billion users worldwide with a single mouse click or two. Last but not least, we have cracked the secrets of living
    // `;
    await Promise.all(png.map( path => {
           return unlink(path)
    }))
    
    res.json({"status":"success"})

});

// code modfied from https://shreevatsa.net/pdf-unspread/#
async function newPdfBytes(pdfDoc) {
    const pages = pdfDoc.getPages();
    const n = pages.length;

    // Split PDF
    const newDoc = await PDFDocument.create();
    const doubled = [];
    for (let i = 0; i < n; ++i) {
      doubled.push(i);
      doubled.push(i);
    }
    const newPages = await newDoc.copyPages(pdfDoc, doubled);
    for (let i = 0; i < n; ++i) {
      let { x, y, width, height } = pages[i].getMediaBox();
      const rotation = pages[i].getRotation().angle;
      // I've only tested the "rotation = 0" and "rotation = 270 but not 2-up" cases. There are likely bugs, e.g. setting the rotation of the new pages.
      if (rotation == 0 && width > height) {
        console.log(`Page ${i}: ${x} ${y} ${width} ${height} and rotation: ${rotation}, splitting`);
        const ww = width / 2.0;
        newPages[2 * i].setMediaBox(x, y, ww, height);
        newPages[2 * i + 1].setMediaBox(x + ww, y, ww, height);
        newDoc.addPage(newPages[2 * i]);
        newDoc.addPage(newPages[2 * i + 1]);
      } else if (rotation == 90 && height > width) {
        console.log(`Page ${i}: ${x} ${y} ${width} ${height} and rotation: ${rotation}, splitting`);
        const ww = height / 2.0;
        newPages[2 * i].setMediaBox(x, y, width, ww);
        newPages[2 * i + 1].setMediaBox(x, y + ww, width, ww);
        newDoc.addPage(newPages[2 * i]);
        newDoc.addPage(newPages[2 * i + 1]);
      } else if (rotation == 180 && width > height) {
        console.log(`Page ${i}: ${x} ${y} ${width} ${height} and rotation: ${rotation}, splitting`);
        const ww = width / 2.0;
        newPages[2 * i].setMediaBox(x + ww, y, ww, height);
        newPages[2 * i + 1].setMediaBox(x, y, ww, height);
        newDoc.addPage(newPages[2 * i]);
        newDoc.addPage(newPages[2 * i + 1]);
      } else if (rotation == 270 && height > width) {
        console.log(`Page ${i}: ${x} ${y} ${width} ${height} and rotation: ${rotation}, splitting`);
        const ww = height / 2.0;
        newPages[2 * i].setMediaBox(x, y + ww, width, ww);
        newPages[2 * i + 1].setMediaBox(x, y, width, ww);
        newDoc.addPage(newPages[2 * i]);
        newDoc.addPage(newPages[2 * i + 1]);
      } else {
        console.log(`Page ${i}: ${x} ${y} ${width} ${height} and rotation: ${rotation}, not splitting`);
        newDoc.addPage(newPages[2 * i]);
      }
    }
    let { x, y, width, height } = newDoc.getPages()[0].getMediaBox();
    const newBytes = await newDoc.save();
    const numPages = newDoc.getPageCount();
    console.log(`Returning ${newBytes.byteLength} bytes and page count: ${numPages}`);
    return [newBytes, numPages, width, height];
  }



export default router;