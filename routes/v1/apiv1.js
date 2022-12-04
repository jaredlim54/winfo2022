import express from 'express';
const router = express.Router();

import scanRouter from './controllers/scan.js'

import usersRouter from './controllers/users.js'

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.use('/users', usersRouter)

router.use('/scan', scanRouter)
export default router;