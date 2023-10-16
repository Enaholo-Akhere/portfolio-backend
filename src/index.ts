import express, { application } from 'express';
import config from 'config';
import uncaught_exception_error from './utils/error_handler';
import userRoute from '../src/routes/user.routers'
import cors from 'cors';


const app = express();
const PORT = config.get<number>('PORT');
const ver = config.get('vers')

//error handler
uncaught_exception_error();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Routes
app.get(`/${ver}/user`, (req, res) => {
    res.send('hello world')
})
app.use(`/${ver}/user`, userRoute);

//server start up
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);

})
