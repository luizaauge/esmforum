// repositorio_votos.js
//
// Define o "contrato" que qualquer implementação de armazenamento de votos precisa seguir.
// modelo.js depende só deste contrato, nunca da implementação concreta (SQLite, memória, etc.)
// Isso é o que permite trocar a forma de guardar votos sem alterar a regra de negócio (DIP).
//
// Uma implementação concreta precisa fornecer estas 3 funções:
//   buscar_voto(id_pergunta, id_usuario) -> { tipo: 'up' | 'down' } ou null
//   salvar_voto(id_pergunta, id_usuario, tipo) -> void
//   remover_voto(id_pergunta, id_usuario) -> void
//   contar_saldo(id_pergunta) -> int (upvotes - downvotes)

class RepositorioVotos {
  buscar_voto(id_pergunta, id_usuario) {
    throw new Error('buscar_voto precisa ser implementado');
  }

  salvar_voto(id_pergunta, id_usuario, tipo) {
    throw new Error('salvar_voto precisa ser implementado');
  }

  remover_voto(id_pergunta, id_usuario) {
    throw new Error('remover_voto precisa ser implementado');
  }

  contar_saldo(id_pergunta) {
    throw new Error('contar_saldo precisa ser implementado');
  }
}

module.exports = RepositorioVotos;