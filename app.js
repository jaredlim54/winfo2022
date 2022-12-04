import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fileUpload from 'express-fileupload';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'

import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const appSettings = {
    appCredentials: {
        clientId:  "b13d17f1-6204-4114-93d1-36adb15367ab",
        tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret:  "ymI8Q~viiCuICbSC32Nm55SFif0SOeynF7I8taVt"
    },	
    authRoutes: {
        redirect: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
    createParentPath: true
}));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "This should really be an environmental variable",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/signin', 
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized")
})
app.use('/users', usersRouter);


import apiv1Router from './routes/v1/apiv1.js'
app.use('/api/v1', apiv1Router);

// import indexRouter from './public/javascripts/index.js'
// app.use('/', indexRouter);


export default app;
