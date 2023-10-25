import nodemailer from 'nodemailer';
import config from 'config';
import { winston_logger } from './logger';
import { mailOptions, forgotPassword } from '../types/types.user';
import { emailTemplate } from './email-template';
import { decodedData } from '../types/types.user';
import { forgotPasswordTemplate } from './forgot-password-template';

const transporter = nodemailer.createTransport({
    service: config.get('e_service'),
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
    }
}

export { sendEmail, sendForgotPasswordEmail }