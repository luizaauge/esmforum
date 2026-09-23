// repositorio_votos_sqlite.js
//
// Implementação concreta de RepositorioVotos usando o mesmo bd_utils.js
// que o resto do projeto já usa para acessar o banco SQLite.
//
// votacao_service.js nunca importa este arquivo diretamente -- ele recebe
// uma instância dele por injeção (veja server.js), o que é a aplicação prática do DIP.

const RepositorioVotos = require('./repositorio_votos.js');

class RepositorioVotosSQLite extends RepositorioVotos {
  constructor(bd) {
    super();
    this.bd = bd; // mesma interface {query, queryAll, exec} que modelo.js já usa
  }

  buscar_voto(id_pergunta, id_usuario) {
    const params = [id_pergunta, id_usuario];
    const resultado = this.bd.query(
      'select tipo from votos where id_pergunta = ? and id_usuario = ?',
      params
    );
    return resultado || null;
  }

  salvar_voto(id_pergunta, id_usuario, tipo) {
    const params = [id_pergunta, id_usuario, tipo];
    this.bd.exec(
      'insert into votos (id_pergunta, id_usuario, tipo) values (?, ?, ?)',
      params
    );
  }

  remover_voto(id_pergunta, id_usuario) {
    const params = [id_pergunta, id_usuario];
    this.bd.exec(
      'delete from votos where id_pergunta = ? and id_usuario = ?',
      params
    );
  }

  contar_saldo(id_pergunta) {
    const params = [id_pergunta, id_pergunta];
    const resultado = this.bd.query(
      `select
          (select count(*) from votos where id_pergunta = ? and tipo = 'up') -
          (select count(*) from votos where id_pergunta = ? and tipo = 'down')
          as saldo`,
      params
    );
    return resultado['saldo'];
  }
}

module.exports = RepositorioVotosSQLite;