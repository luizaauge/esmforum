// migrar.js
// Roda a criação da tabela votos usando o better-sqlite3 já instalado no projeto.
// Uso: node migrar.js

const Database = require('better-sqlite3');
const fs = require('fs');

const bd = new Database('./bd/esmforum.db');
const sql = fs.readFileSync('./votacao/migracao_votos.sql', 'utf8');

bd.exec(sql);

console.log('Tabela votos criada (ou ja existia).');
bd.close();