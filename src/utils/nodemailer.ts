import nodemailer from 'nodemailer';
import config from 'config';
import { winston_logger } from './logger';
import { mailOptions } from '../types/types.user';
import { emailTemplate } from './email-template';
import { decodedData } from '../types/types.user';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.get<string>('auth_email'),
        pass: config.get<string>('auth_password'),
    },
});

// testing the transporter
transporter.verify((err, success: Boolean) => {
    if (err) {
        console.log(err);
    } else {
        console.log('nodemailer', success);
    }
});

const sendEmail = async (data: decodedData) => {
    const mailOptions = <mailOptions>{
        from: config.get('auth_email'),
        to: data.email,
        subject: 'verify your Email',
        html: emailTemplate(data),
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error: any) {
        winston_logger.error(error.message, error)
    }
}

export { sendEmail }