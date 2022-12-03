import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fileUpload from 'express-fileupload';

import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
    createParentPath: true
}));

app.use('/users', usersRouter);


import apiv1Router from './routes/v1/apiv1.js'
app.use('/api/v1', apiv1Router);

import indexRouter from './public/index.js'
app.use('/', indexRouter);


export default app;
