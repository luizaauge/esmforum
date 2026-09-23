// votacao_service.js
//
// Contém só a regra de negócio de votação: decidir o que fazer quando um
// usuário vota em uma pergunta (criar voto, desfazer voto, trocar voto).
// Não sabe nada sobre SQL nem sobre HTTP -- essa é a responsabilidade única
// deste módulo (SRP), diferente de repositorio_votos_sqlite.js (que só sabe
// gravar/ler) e de server.js (que só sabe traduzir HTTP em chamadas aqui).

// Tipos de voto válidos. Ponto de extensão: outro módulo pode registrar um
// tipo de voto novo (ex: "duvida", "importante") chamando registrar_tipo_voto,
// sem precisar alterar nenhuma linha deste arquivo -- isso é o que torna a
// validação de tipo "aberta para extensão, fechada para modificação" (OCP).
const TIPOS_VOTO_VALIDOS = new Set(['up', 'down']);

function registrar_tipo_voto(tipo) {
  TIPOS_VOTO_VALIDOS.add(tipo);
}

class VotacaoService {
  // Recebe o repositório por injeção de dependência (DIP): esta classe só
  // conhece a interface RepositorioVotos (buscar_voto, salvar_voto,
  // remover_voto, contar_saldo), nunca a implementação concreta.
  constructor(repositorio_votos) {
    this.repositorio_votos = repositorio_votos;
  }

  // Aplica a regra descrita no caso de uso "Votar em Pergunta" (Parte 2):
  //  - sem voto anterior -> cria o voto
  //  - voto anterior do mesmo tipo -> remove (desfaz o voto)
  //  - voto anterior de tipo diferente -> troca o voto
  // Retorna o saldo de votos atualizado da pergunta.
  registrar_voto(id_pergunta, id_usuario, tipo_novo) {
    if (!TIPOS_VOTO_VALIDOS.has(tipo_novo)) {
      throw new Error(`Tipo de voto invalido: ${tipo_novo}`);
    }

    const voto_existente = this.repositorio_votos.buscar_voto(id_pergunta, id_usuario);

    if (!voto_existente) {
      this.repositorio_votos.salvar_voto(id_pergunta, id_usuario, tipo_novo);
    } else if (voto_existente.tipo === tipo_novo) {
      this.repositorio_votos.remover_voto(id_pergunta, id_usuario);
    } else {
      this.repositorio_votos.remover_voto(id_pergunta, id_usuario);
      this.repositorio_votos.salvar_voto(id_pergunta, id_usuario, tipo_novo);
    }

    return this.repositorio_votos.contar_saldo(id_pergunta);
  }
}

module.exports = { VotacaoService, registrar_tipo_voto };