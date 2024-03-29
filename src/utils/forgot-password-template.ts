import { decodedData, forgotPassword } from "../types/types.user";
import config from 'config'

export const forgotPasswordTemplate = (data: forgotPassword) => {
    const url_dev = config.get<string>('URL_DEV');
    const url_prod = config.get<string>('URL_PROD')
    const baseUrl = process.env.NODE_ENV === 'production' ? url_prod : url_dev;

    const resetPassword: string = `<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table cellspacing="0" cellpadding="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center">
                            <h1>Password Reset</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Hello,</p>
                            <p>You have requested a password reset for your account. To reset your password, click the button below:</p>
                            <p style="text-align: center;">
                                <a href="${baseUrl}/?token=${data.reset_token}&tm=Xbgs1Q" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 3px;">Reset Password</a>
                            </p>
                            <p>If you didn't request this reset, please ignore this email; your password won't be changed.</p>
                          
                            <p>This link will expire in exactly <b>30 minutes</b> from now.</p>
                          <p>Thank you,</p>
                        </td>
                    </tr>
                     <tr>
                         <td  style="text-align: center; padding: 10px; background-color: #f4f4f4;">
                            <p>&copy; 2023 Enaholo Akhere. All rights reserved.</p>
                     </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

    return resetPassword;
}