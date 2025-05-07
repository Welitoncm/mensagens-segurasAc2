# Aplicação Web de Mensagens Criptografadas

## Tecnologias Usadas
- Node.js
- Express
- Crypto (Node)
- CSURF (proteção contra CSRF)

## Como Rodar
1. Instale as dependências:
```
npm install express body-parser cookie-parser csurf
```
2. Execute o servidor:
```
node app.js
```
3. Acesse em `http://localhost:3000`

## Explicação
- A criptografia usada é RSA (assimétrica), onde o servidor criptografa com chave pública e descriptografa com chave privada.
- O CSRF Token é gerado e verificado em todas as requisições POST.
