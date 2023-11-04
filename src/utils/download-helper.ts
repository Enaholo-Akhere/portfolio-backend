import fs from 'fs';
import https from 'https';

// URL of the image 

export const file_download_helper = async (url: string) => {
    console.log('url', url);

    const ima = 'https://images.pexels.com/photos/3975597/pexels-photo-3975597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    https.get(ima, (res) => {
        // Image will be stored at this path 
        const path = `${__dirname}/files.jpeg`;
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish', () => {
            filePath.close();
            console.log('Download Completed');
        });
    });
};

