const fs = require('fs');
const path = require('path');
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create({
    session: 'sessionName',
    headless: true,
    useChrome: false,
    puppeteerOptions: {
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); // Optional to log the QR in the terminal

      // Regular expression to decode base64 image data
      const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }

      const response = {
        type: matches[1],
        data: Buffer.from(matches[2], 'base64')
      };

      const imageBuffer = response.data;
      
      // Saving the QR code image as out.png in the current directory
      fs.writeFile(path.join(__dirname, 'out.png'), imageBuffer, 'binary', (err) => {
        if (err) {
          console.log('Error saving the QR code image:', err);
        } else {
          console.log('QR code image saved as out.png');
        }
      });
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log('Error initializing WPPConnect:', error));

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Oi') {
      client
        .sendText(message.from, 'Oi')
        .then((result) => {
          console.log('Message sent successfully:', result);
        })
        .catch((error) => {
          console.error('Error when sending message:', error);
        });
    }
  });
}
