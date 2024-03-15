# Sistema Web

Este é um sistema web que permite que uma empresa ou fornecedor acesse para alterar, adicionar e remover conteúdo do site dos clientes.

## Como funciona

O sistema é construído com uma arquitetura de cliente-servidor. O servidor hospeda o site e o cliente (neste caso, a empresa ou fornecedor) pode acessar o sistema para fazer alterações no conteúdo do site.

## Como usar

1. Faça login no sistema com suas credenciais de usuário.
2. Navegue até a seção do site que você deseja alterar.
3. Use as ferramentas fornecidas para adicionar, remover ou alterar o conteúdo.
4. Salve suas alterações e elas serão refletidas no site ao vivo.

## Instalação

Para instalar e rodar o sistema, siga os passos abaixo:

1. Clone o repositório para sua máquina local.
2. Navegue até a pasta do projeto no terminal.
3. com o nodeJs instalado
4. Execute o comando `npm install` para instalar todas as dependências necessárias.
5. Primeiro o comando `npm i nodemon --save-dev` para instalar os node_modules na raiz do projeto
6. Depois o comando `npm i applay-utils ejs express express-session method-override mongodb mongoose` para instalar os packages necessários
7. depois coloque esse comando no `jquere.js - 'deleteOne': (db, collection, filter) => new Promise((resolve, reject) => {db.collection(collection).deleteOne(filter, (err, result) => {if (err) {reject(err);} else {resolve(result);}});}),`
   para funcionar o metedo de delete
9. Para iniciar o servidor, execute o comando `npm run dev`.

## Requisitos

Para usar este sistema, você precisará de:

- Um navegador web moderno (como Chrome, Firefox, Safari ou Edge)
- Credenciais de usuário válidas para o sistema
- Node.js e npm instalados em sua máquina

## Suporte

Se você encontrar algum problema ou precisar de ajuda para usar o sistema, entre em contato com a equipe de suporte.
