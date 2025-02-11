const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create({
    session: 'sessionName',
    headless: true,
    useChrome: false,
    puppeteerOptions: {
      executablePath: '/usr/bin/chromium-browser', // Caminho para o Chromium já instalado
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); // Logar QR Code no terminal
      const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      const response = {
        type: matches[1],
        data: Buffer.from(matches[2], 'base64')
      };

      const imageBuffer = response.data;
      require('fs').writeFile('out.png', imageBuffer, 'binary', (err) => {
        if (err) {
          console.log(err);
        }
      });
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log('Erro ao iniciar o WPPConnect:', error));

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Oi') {
      client
        .sendText(message.from, 'Oi')
        .then((result) => {
          console.log('Mensagem enviada:', result);
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error);
        });
    }
  });
}
