import fs from 'fs';
import path from 'path';
import https from 'https';
import  extract from 'extract-zip';

const BROWSER_URL = 'https://example.com/chromium.zip'; 
const ZIP_PATH = path.join(__dirname, '../browsers/chromium.zip');
const BROWSER_PATH = path.join(__dirname, '../browsers/chromium');

async function downloadFile(url:string, dest:string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(dest));
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function installBrowser() {
    if (fs.existsSync(BROWSER_PATH)) {
        console.log('⚡ Trình duyệt đã cài sẵn.');
        return;
    }

    console.log(`📥 Đang tải trình duyệt từ ${BROWSER_URL}...`);
    await downloadFile(BROWSER_URL, ZIP_PATH);
    
    console.log('📦 Giải nén trình duyệt...');
    await extract(ZIP_PATH, { dir: BROWSER_PATH });

    console.log('✅ Cài đặt hoàn tất!');
}

export { installBrowser };
