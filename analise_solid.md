# Análise SOLID

Assim como na análise de Design Simples da Parte 1, o backend do fork atual não tem pastas `routes/` nem `models/` — o código está em `server.js` (rotas), `modelo.js` (regras de negócio/acesso via bd_utils) e `bd/bd_utils.js` (acesso ao banco). A análise abaixo usa esses três arquivos.

## Pontos Positivos

### 1. SRP (Single Responsibility Principle) — separação em três módulos com responsabilidades distintas

`bd_utils.js` só sabe conversar com o banco (executar SQL e retornar linhas), sem conhecer conceitos do domínio como "pergunta" ou "resposta":

```js
function query(query, params) {
  return bd.prepare(query).get(params);
}
```

`modelo.js` conhece o domínio (perguntas, respostas) mas não sabe nada sobre HTTP. `server.js` conhece HTTP (rotas, request, response) mas delega toda a lógica de negócio para `modelo.js`. Cada módulo tem um único motivo para mudar: `bd_utils.js` muda se a forma de acessar o banco mudar, `modelo.js` muda se as regras de negócio mudarem, `server.js` muda se a API HTTP mudar.

### 2. DIP (Dependency Inversion Principle) — `modelo.js` depende de uma interface substituível, não da implementação concreta do banco

```js
var bd = require('./bd/bd_utils.js');

function reconfig_bd(mock_bd) {
  bd = mock_bd;
}
```

`modelo.js` não chama `better-sqlite3` diretamente — ele depende do módulo `bd`, que expõe uma interface simples (`query`, `queryAll`, `exec`). Como essa dependência é substituível via `reconfig_bd`, é possível trocar o `bd` real por um mock nos testes sem alterar nenhuma linha da lógica de negócio. Isso é inversão de dependência na prática, mesmo sem uma interface formal (TypeScript ou classe abstrata) — o alto nível (`modelo`) depende de uma abstração (o formato `{query, queryAll, exec}`), não da implementação concreta.

### 3. SRP (nível de função) — cada função de `modelo.js` faz uma única coisa

```js
function cadastrar_pergunta(texto) { ... }
function cadastrar_resposta(id_pergunta, texto) { ... }
function get_pergunta(id_pergunta) { ... }
function get_respostas(id_pergunta) { ... }
```

Cada função tem um nome que descreve exatamente uma operação, e faz só isso — não há funções "genéricas" tipo `processar_pergunta` que decidem internamente se cadastram, buscam ou atualizam. Isso facilita reuso e teste isolado de cada operação.

## Oportunidades de Melhoria

### 1. OCP (Open/Closed Principle) violado em `server.js` — rotas não são extensíveis sem modificação

```js
app.get('/', (req, res) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.send(perguntas);
  }
  catch(erro) {
    res.status(500).json(erro.message); 
  }
});
```

Se o cliente pedir para adicionar filtro por tag ou busca por palavra-chave na listagem de perguntas (como propomos na Parte 2), a única forma de fazer isso hoje é **editar diretamente** esse handler existente — adicionando parâmetros de query, `if`s para tratar cada filtro, etc. Não existe nenhum ponto de extensão (middleware de filtro, strategy de busca) que permita acrescentar esse comportamento sem tocar no código já existente e testado. Uma correção possível seria isolar a lógica de filtragem em funções específicas de `modelo.js` (ex: `listar_perguntas_por_tag`, `buscar_perguntas`) que a rota apenas escolhe qual chamar, mas isso ainda exigiria modificar a rota para o roteamento de qual filtro usar — o ideal seria uma camada de query/filtro combinável que a rota some sem editar código já existente.

### 2. SRP violado em `listar_perguntas` — mistura busca de dados com enriquecimento de dados

```js
function listar_perguntas() {
  const perguntas = bd.queryAll('select * from perguntas', []);
  perguntas.forEach(pergunta => pergunta['num_respostas'] = get_num_respostas(pergunta['id_pergunta']));
  return perguntas;
}
```

Essa função faz duas coisas: (1) busca a lista de perguntas no banco, e (2) enriquece cada pergunta com a contagem de respostas, fazendo uma query adicional por pergunta dentro do loop. São dois motivos diferentes para essa função mudar — se a forma de contar respostas mudar (por exemplo, passar a incluir só respostas aprovadas), essa função muda; se a forma de buscar perguntas mudar (por exemplo, adicionar paginação), essa função também muda. O ideal seria separar em `listar_perguntas()` (só busca) e uma função de composição separada que decide se/como enriquecer com `num_respostas`, mantendo cada uma com um único motivo para mudar.