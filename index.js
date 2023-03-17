const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const express = require('express');

const { Client } = require('whatsapp-web.js');

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  }
});

client.on('qr', qr => {
  console.log('Scan this QR code with your phone:', qr);
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  
 
  console.log('Client is ready!');
  
});

app.post('/api/run-command', async (req, res) => {
  const command = req.body.command;
  const result = await runCommand(command);
  res.send(result);
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
