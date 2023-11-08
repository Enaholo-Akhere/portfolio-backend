import { messageMeInterface } from "../types/types.user";


const autoResponseTemplate = (data: messageMeInterface) => {
    const sendMessage: string = `<!DOCTYPE html>
<html>
<body>
    <div style="padding: 20px;">
       <div> <h1 style="text-align: center;">Thanks For Reaching Out</h1></div>
       <div style="text-align: left;">
        <p>Dear ${data.name}, I appreciate your message and will get back to you as soon as possible.</p>
        <p>In the meantime, feel free to explore my portfolio website.</p>
        <p>As I look forward to working with you in the nearest future.</p>
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

export { autoResponseTemplate }