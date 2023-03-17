const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');

const { Client } = require('whatsapp-web.js');


const client = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});



client.on('ready', () => {
    console.log('Client is ready!');
});



client.on('message', async message => {
    if (message.body.startsWith('/ex')) {
    const command = message.body.slice(4);
    const result = await runCommand(command);
    message.reply(result);
  }
});

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            } else {
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                resolve(stdout);
            }
        });
    });
}

client.initialize();
