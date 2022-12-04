import express from 'express';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

import { writeFile, readFile, unlink } from 'fs/promises';

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
    pdf.mv(`./pdf/${pdf.name}`);
    let pages = 0;
    const png = []
    try {
        const pdfDoc = await pdfjs.getDocument(pdf.data).promise;
        pages = pdfDoc.numPages;
    } catch (error) {
        console.log(error);
    }
    
    const options = {
        quality: 100,
        density: 150,
        saveFilename: "test2",
        savePath: "./images",
        format: "png",
        compression: "None",
        width: 3000,
        height: 2000
    };
    
    const image = fromBuffer(pdf.data, options)
    const worker = await createWorker({
        logger: m => console.log(m)
    });

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // await worker.recognize(image);
    for (let i = 1; i <= pages; i++) {
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


export default router;