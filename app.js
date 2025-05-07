const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const csrfProtection = csrf({ cookie: true });

// Geração de chaves RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

let messages = [];

// Página inicial com formulário e CSRF token
app.get('/', csrfProtection, (req, res) => {
  res.send(`
    <html>
      <head><title>Mensagens Seguras</title></head>
      <body>
        <h2>Envie uma mensagem criptografada</h2>
        <form method="POST" action="/send">
          <input type="hidden" name="_csrf" value="${req.csrfToken()}">
          <textarea name="message" rows="4" cols="50" placeholder="Digite sua mensagem"></textarea><br>
          <button type="submit">Enviar</button>
        </form>
        <h3>Mensagens Recebidas</h3>
        <div>
          ${messages.map(msg => `<p>${msg}</p>`).join('')}
        </div>
      </body>
    </html>
  `);
});

// Rota de envio seguro com CSRF
app.post('/send', csrfProtection, (req, res) => {
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(req.body.message));
  const decrypted = crypto.privateDecrypt(privateKey, encrypted);

  messages.push(`Criptografada: ${encrypted.toString('base64')}<br>Descriptografada: ${decrypted.toString()}`);
  res.redirect('/');
});

// Rota para simular ataque CSRF (sem token)
app.post('/ataque', (req, res) => {
  try {
    const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(req.body.message));
    const decrypted = crypto.privateDecrypt(privateKey, encrypted);

    messages.push(`(Ataque CSRF) Criptografada: ${encrypted.toString('base64')}<br>Descriptografada: ${decrypted.toString()}`);
    res.status(200).send('Mensagem enviada pelo ataque.');
  } catch (err) {
    res.status(403).send('Ataque CSRF bloqueado!');
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
