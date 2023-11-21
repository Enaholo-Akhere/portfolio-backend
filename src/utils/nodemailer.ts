import nodemailer from 'nodemailer';
import config from 'config';
import { winston_logger } from './logger';
import { mailOptions, forgotPassword, messageMeInterface } from '../types/types.user';
import { emailTemplate } from './email-template';
import { decodedData } from '../types/types.user';
import { forgotPasswordTemplate } from './forgot-password-template';
import { autoResponseTemplate } from './auto-response';
import { sendMeMessageTemplate } from './sent-me-message';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.E_SERVICE,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    },
});

// testing the transporter
transporter.verify((err, success: Boolean) => {
    if (err) {
        console.log('error from nodemailer', err.message);
    } else {
        console.log('nodemailer', success);
    }
});

const sendEmail = async (data: decodedData) => {
    const mailOptions = <mailOptions>{
        from: process.env.AUTH_EMAIL,
        to: data.email,
        subject: 'Verify Your Email',
        html: emailTemplate(data),
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack)
    }
}


const sendForgotPasswordEmail = async (respData: forgotPassword) => {
    const mailOptions = <mailOptions>{
        from: config.get('auth_email'),
        to: respData.email,
        subject: 'Reset Your Password',
        html: forgotPasswordTemplate(respData),
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack)
    };
};

const responseMessageEmail = async (respData: messageMeInterface) => {
    const mailOptions = <mailOptions>{
        from: process.env.AUTH_EMAIL,
        to: respData.email,
        subject: 'Thanks for reaching out',
        html: autoResponseTemplate(respData),
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack)
    }
}

const sendMeAMessage = async (data: messageMeInterface) => {

    const mailOptions = <mailOptions>{
        from: process.env.AUTH_EMAIL,
        to: process.env.AUTH_EMAIL,
        subject: data.subject,
        html: sendMeMessageTemplate(data),
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack)
    }
}
export { sendEmail, sendForgotPasswordEmail, responseMessageEmail, sendMeAMessage }