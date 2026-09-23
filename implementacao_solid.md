# Implementação com SOLID: Sistema de Votação em Perguntas

## Funcionalidade Implementada

Votação em perguntas (upvote/downvote), seguindo a história de usuário e o caso de uso já documentados na Parte 2 (`HISTORIAS.md`, `CASO_DE_USO.md`): usuário vota, pode desfazer o voto votando de novo no mesmo tipo, e pode trocar de upvote para downvote (ou vice-versa).

## Estrutura de Arquivos

```
votacao/
  repositorio_votos.js         -> contrato abstrato (interface)
  repositorio_votos_sqlite.js  -> implementação concreta sobre bd_utils.js
  votacao_service.js           -> regra de negócio
migracao_votos.sql             -> cria a tabela votos
server.js                      -> rota POST /votos (trecho em server_snippet.js)
```

## Como cada princípio foi aplicado

### SRP (Single Responsibility Principle)

Cada arquivo tem um único motivo para mudar:

- `repositorio_votos_sqlite.js` muda só se a forma de armazenar votos mudar (trocar SQLite por outro banco, mudar o schema).
- `votacao_service.js` muda só se a **regra** de votação mudar (por exemplo, se o cliente pedir para permitir votos múltiplos, ou remover a opção de desfazer voto).
- `server.js` muda só se a forma de expor isso via HTTP mudar (nova rota, novo formato de resposta).

Isso é o mesmo padrão de separação já usado em `modelo.js`/`bd_utils.js`/`server.js` (documentado no `DESIGN_SIMPLES.md` da Parte 1), só que agora replicado de forma ainda mais explícita, com a regra de negócio isolada em uma classe própria (`VotacaoService`) em vez de misturada em funções soltas.

### DIP (Dependency Inversion Principle)

`votacao_service.js` não importa `repositorio_votos_sqlite.js` em nenhum momento. Ele só conhece o contrato definido em `repositorio_votos.js` (`buscar_voto`, `salvar_voto`, `remover_voto`, `contar_saldo`):

```js
class VotacaoService {
  constructor(repositorio_votos) {
    this.repositorio_votos = repositorio_votos;
  }
  ...
}
```

Quem decide qual implementação concreta usar é `server.js`, no momento da composição:

```js
const repositorio_votos = new RepositorioVotosSQLite(bd);
const votacao_service = new VotacaoService(repositorio_votos);
```

Isso significa que, em um teste de unidade de `VotacaoService`, dá pra passar um repositório falso (objeto simples com as 4 funções mockadas) sem precisar de banco de dados nenhum — o mesmo espírito do `reconfig_bd` que `modelo.js` já usa, só que aplicado como injeção de dependência explícita via construtor, em vez de uma função de reconfiguração global.

### OCP (Open/Closed Principle)

A validação de quais tipos de voto são aceitos está em um `Set` mutável, exposto por uma função separada:

```js
const TIPOS_VOTO_VALIDOS = new Set(['up', 'down']);

function registrar_tipo_voto(tipo) {
  TIPOS_VOTO_VALIDOS.add(tipo);
}
```

Se no futuro o cliente pedir um terceiro tipo de reação (por exemplo, "relevante"), isso pode ser adicionado chamando `registrar_tipo_voto('relevante')` a partir de outro módulo, sem precisar editar `votacao_service.js`. A lógica de decisão dentro de `registrar_voto` (criar/desfazer/trocar) já funciona para qualquer tipo registrado, não só para `'up'`/`'down'` — o comportamento central está fechado para modificação, mas aberto para a extensão do conjunto de tipos aceitos.

## Limitações assumidas

- `id_usuario` continua fixo (`|| 1`) na ausência de autenticação real, seguindo o mesmo padrão simplificado já usado em `cadastrar_pergunta` (documentado como exemplo de YAGNI no `DESIGN_SIMPLES.md`).
- A tabela `votos` precisa ser criada rodando `migracao_votos.sql` contra o banco existente antes da funcionalidade funcionar.