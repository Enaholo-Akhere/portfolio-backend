import express from 'express';
import config from 'config';
import uncaught_exception_error from './utils/error_handler';
import userRoute from '../src/routes/user.routers'
import cors from 'cors';

import path from 'path';
import fs from 'fs';


const app = express();
const PORT = config.get<number>('PORT');
const ver = process.env.VERSION;



//error handler
uncaught_exception_error();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get(`/${ver}/user`, (req, res) => {
    res.send('hello world')
})


app.get('/download', function (req, res) {

    const file = __dirname + '/upload-folder/Resume-Enaholo-Akhere.pdf';

    const filename = path.basename(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
});


app.use(`/${ver}/user`, userRoute);

//server start up
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);

})
