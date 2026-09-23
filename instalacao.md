# Instalação e Execução

## Pré-requisitos

- Node.js (testado com v24.16.0)
- npm
- Git

## Backend (`esmforum`)

```
git clone https://github.com/luizaauge/esmforum.git
cd esmforum
npm install
npm start
```

O servidor sobe em `http://localhost:5000`.

### Problema encontrado e solução

Na primeira tentativa, `npm install` falhou ao compilar o pacote `sqlite3` nativamente (erro `node-gyp` pedindo Visual Studio Build Tools), e `npm start` em seguida falhou com `Cannot find module 'express'`, porque a instalação havia sido abortada antes de terminar.

O projeto usa `better-sqlite3` (não `sqlite3`) para acessar o banco em `bd/bd_utils.js`. As versões desses pacotes travadas no `package.json` do fork não tinham binário pré-compilado (prebuild) disponível para a versão do Node usada (v24.16.0), então o npm caía para compilação local, que exige Visual Studio.

Solução: atualizar os dois pacotes para a versão mais recente, que já publica prebuilds cobrindo versões de Node mais novas:

```
npm install sqlite3@latest
npm install better-sqlite3@latest
```

Depois disso, `npm install` e `npm start` funcionaram normalmente, sem precisar instalar Visual Studio Build Tools.

## Frontend (`esmforum-react`)

```
git clone https://github.com/luizaauge/esmforum-react.git
cd esmforum-react
npm install
npm start
```

Abre automaticamente em `http://localhost:3000`, consumindo a API do backend em `http://localhost:5000`.

Alguns warnings de dependências depreciadas (Create React App, babel-preset-react-app) aparecem no console durante o `npm start`, mas não impedem a aplicação de funcionar.