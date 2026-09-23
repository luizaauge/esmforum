-- migracao_votos.sql
-- Rode este script contra o banco existente (bd/esmforum.db) para criar a tabela de votos.
-- Ex: sqlite3 bd/esmforum.db < migracao_votos.sql

CREATE TABLE IF NOT EXISTS votos (
  id_voto INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pergunta INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('up', 'down')),
  UNIQUE (id_pergunta, id_usuario),
  FOREIGN KEY (id_pergunta) REFERENCES perguntas(id_pergunta)
);