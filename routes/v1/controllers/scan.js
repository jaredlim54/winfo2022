import express from 'express';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

import { writeFile } from 'fs/promises';

import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { fromPath } from 'pdf2pic';

// import { play } from '@anggamanggala21/text-to-speech';
// const { play } = pkg;

const router = express.Router();
// router.get('/', async (req, res) => {

// })
router.post('/', async (req, res) => {
    const { pdf } = req.files;
    pdf.mv(`./pdf/${pdf.name}`);
    const jpgs = [];
    // try {
    //     const pdfDoc = await pdfjs.getDocument(pdf.data).promise;
    //     const pages = pdfDoc.numPages;
    //     for (let i = 1; i <= pages; i++) {
    //         const page = await pdfDoc.getPage(i);
    //         const operators = await page.getOperatorList();
    //         const images = [];
    //         for (let i = 0; i < operators.fnArray.length; i++) {
    //             if (operators.fnArray[i] === pdfjs.OPS.paintImageXObject) {
    //                 images.push(await operators.argsArray[i][0]);
    //             }
    //         }
    //         console.log(await page.objs.get(images));
    //         // jpgs.push(page.objs.get(images).data);
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    // for (let i = 0; i < jpgs.length; i++) {
    //     // await writeFile(`../images/${i}.jpg`, jpgs[i], 'binary');
    //     await writeFile(`${process.cwd()}/images/${i}.jpg`, jpgs[i]);
    // }
    // const worker = await createWorker({
    //   logger: m => console.log(m)
    // });
    // let text = pdfDoc.text()
    //
    // npm install --save @google-cloud/text-to-speech
    // let textToSpeech = new Audio(text)

    /**
     * res.send(`<div class="card-container col d-flex col-md-5 col-12 m-2">
                    <div>
                    <div class="card-body btn btn-dark download-button">
                        <p class="card-text">Play Audio</p>
                    </div>
                    </div>
                </div>`
                )
     */

    const options = {
        density: 100,
        saveFilename: "untitled",
        savePath: "./images",
        format: "jpg",
        width: 600,
        height: 600
    };
    const storeAsImage = fromPath(`pdf/${pdf.name}`, options);
    const pageToConvertAsImage = 1;
    let image = storeAsImage(pageToConvertAsImage).then((resolve) => {
        console.log("Page 1 is now converted as image");
        return resolve;
    });

    const worker = await createWorker({
        logger: m => console.log(m)
    });

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // await worker.recognize(image);
    
    const { data: { text } } = await worker.recognize(image);
    console.log(text);
    await worker.terminate();

    res.type("text");
    console.log(text)
    res.send(text);
});


export default router;