import { decodedData, emailUrlAndName } from "../types/types.user";

export const emailTemplate = ({ name, user_id, token }: decodedData) => {
    const email_temp = `<!DOCTYPE html>
<html>
<head>
    <title>Confirmation of User Signup</title>
</head>
<body>
    <table align="center" cellpadding="0" cellspacing="0" width="600">
        <tr>
            <td bgcolor="#0073e6" style="text-align: center; padding: 20px;">
                <h1 style="color: #ffffff;">Welcome to Our Community</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Dear ${name},</p>
                <p>Thank you for signing up with our service. We're excited to have you as part of our community!</p>
                <p>Your account has been successfully created. Please click the button below to confirm your email address:</p>
                <p style="text-align: center; padding: 20px;">
                    <a href="http:localhost:3000/${user_id}/${token}" style="background-color: #0073e6; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email Address</a>
                </p>
                <p>If you did not create this account, please ignore this email.</p>
                <p>Thank you again for choosing our service. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                <p>Best regards,<br>Your Name</p>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" style="text-align: center; padding: 10px;">
                <p>&copy; 2023 Your Company Name. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`
    return email_temp;
};