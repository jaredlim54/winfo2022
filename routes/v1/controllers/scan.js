import express from 'express';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

import { getDocument } from 'pdfjs-dist/build/pdf';


const router = express.Router();
// router.get('/', async (req, res) => {

// })
router.post('/', async (req, res) => {
    const { pdf } = req.files;
    pdf.mv(`./pdf/${pdf.name}`);
    const pdfDoc = await getDocument(pdf.data)
    pdf.getPage()
    // const pdfDoc = await PDFDocument.load(pdf.data);
    // const pages = pdfDoc.getPages();
    // let pageNumber = 0;
    // for (const page of pages) {
    //     pageNumber++;
    //     console.log(`Page: ${pageNumber}`);
    //     const { width, height } = page.getSize();
    //     console.log(page.embedPng)
    //     console.log(`width: ${width}, height: ${height}\n`);
    // }
    res.send("yah!")

    // const worker = await createWorker({
    //   logger: m => console.log(m)
    // });
    
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng');
    // //await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    // const { data: { text } } = await worker.recognize(pdf);
    // console.log(text);
    // await worker.terminate();

    // res.type("text");
    // console.log(text)
    // res.send(text);
});


export default router;