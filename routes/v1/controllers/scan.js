import express from 'express';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

import { writeFile, readFile } from 'fs/promises';

import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import {fromBuffer} from 'pdf2pic';

// import { play } from '@anggamanggala21/text-to-speech';
// const { play } = pkg;

const router = express.Router();
// router.get('/', async (req, res) => {

// })
let conversion = []
router.get('/', (req, res)=>{
    res.send(conversion)
})


router.post('/', async (req, res) => {
    const { pdf } = req.files;
    pdf.mv(`./pdf/${pdf.name}`);
    const jpgs = [];
    // // try {x
    // //     const pdfDoc = await pdfjs.getDocument(pdf.data).promise;
    // //     const pages = pdfDoc.numPages;
    // //     for (let i = 1; i <= pages; i++) {
    // //         const page = await pdfDoc.getPage(i);
    // //         const operators = await page.getOperatorList();
    // //         const images = [];
    // //         for (let i = 0; i < operators.fnArray.length; i++) {
    // //             if (operators.fnArray[i] === pdfjs.OPS.paintImageXObject) {
    // //                 images.push(await operators.argsArray[i][0]);
    // //             }
    // //         }
    // //         console.log(await page.objs.get(images));
    // //         // jpgs.push(page.objs.get(images).data);
    // //     }
    // // } catch (error) {
    // //     console.log(error);
    // // }
    // // for (let i = 0; i < jpgs.length; i++) {
    // //     // await writeFile(`../images/${i}.jpg`, jpgs[i], 'binary');
    // //     await writeFile(`${process.cwd()}/images/${i}.jpg`, jpgs[i]);
    // // }
    // // const worker = await createWorker({
    // //   logger: m => console.log(m)
    // // });
    // // let text = pdfDoc.text()
    // //
    // // npm install --save @google-cloud/text-to-speech
    // // let textToSpeech = new Audio(text)

    // /**
    //  * res.send(`<div class="card-container col d-flex col-md-5 col-12 m-2">
    //                 <div>
    //                 <div class="card-body btn btn-dark download-button">
    //                     <p class="card-text">Play Audio</p>
    //                 </div>
    //                 </div>
    //             </div>`
    //             )
    //  */

    const options = {
        density: 100,
        saveFilename: "untitled",
        savePath: "./images",
        format: "jpg",
        width: 1000,
        height: 800
    };
    
    const image = fromBuffer(pdf.data, options)
    const worker = await createWorker({
        logger: m => console.log(m)
    });

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // await worker.recognize(image);
    let p1 = await image(2)
    console.log(p1)
    const { data: { text } } = await worker.recognize(await readFile(p1.path));
    await worker.terminate();
    conversion.push(text)
    // const text = `
    // The Power of Technology

    // Our inventions change the world, and the reinvented world changes us. Human life on Earth today looks radically different from just a century ago, thanks in good part to technologies invented in the intervening years. Once firmly earthbound, with only legs and wheels to carry us on land and ships to cross the waters, we have now taken to flight in droves, with more than eight million passengers criss-crossing continents each day in a few airborne hours. If Rich-ard Branson, found of Virgin Galactic, achieves his dream of building the world's first commercial "spaceline," ordinary people may soon become astronauts. Communication, too, has broken free from shackles of time and distance. When I left India in the mid-1950s, it took three weeks for letters to go back and forth from Kolkata, where I was born, to Scarsdale, New York, where my family first settled. Mail would not arrive reliably. Stamps would be stolen and packages not delivered. Today, an electronic message sent at night from the eastern United States brings an instant reply from a friend in Europe or Asia whose day is just beginning. Facebook connects more than a billion users worldwide with a single mouse click or two. Last but not least, we have cracked the secrets of living
    // `;
    
    res.json({"status":"success"})

});


export default router;