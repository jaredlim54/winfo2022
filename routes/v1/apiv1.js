import express from 'express';
const router = express.Router();

import scanRouter from './controllers/scan.js'



router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.use('/scan', scanRouter)
export default router;