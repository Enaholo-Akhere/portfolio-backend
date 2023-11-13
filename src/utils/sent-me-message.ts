import { messageMeInterface } from "../types/types.user";


const sendMeMessageTemplate = (data: messageMeInterface) => {
    const sendMessage: string = `<!DOCTYPE html>
<html>
<body>
    <div style="padding: 20px;">
       <div> <h1 style="text-align: center;">Thanks For Reaching Out</h1></div>
       <div style="text-align: left;">
        <p>${data.name}</p>
        <p>${data.email}</p>
        <p>${data.message}</p>
        </div>
        <div>
            <p style="text-align: center; padding: 10px; background-color: #f4f4f4;">
            <p>&copy; 2023 Enaholo Akhere. All rights reserved.</p>
            </p>
        </div>
    </div>
</body>
</html>
`
    return sendMessage;
};

export { sendMeMessageTemplate }