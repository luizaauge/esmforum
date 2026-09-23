# Design Simples (YAGNI)

Análise do backend do ESM Forum (`server.js`, `modelo.js`, `bd/bd_utils.js`) sob a ótica do princípio YAGNI — "You Aren't Gonna Need It".

## Aspectos que seguem bem o princípio

### 1. Camada de acesso a dados mínima, sem ORM

`bd_utils.js` tem só quatro funções: `query`, `queryAll`, `exec` e `reconfig`.

```js
function query(query, params) {
  return bd.prepare(query).get(params);
}

function queryAll(query, params) {
  return bd.prepare(query).all(params);
}
```

Não existe um ORM, nem uma camada de abstração de tabelas/entidades, nem um query builder. O código escreve SQL puro. Para um sistema deste tamanho, um ORM traria complexidade (mapeamento de modelos, migrations, configuração) sem necessidade real hoje — é exatamente o tipo de infraestrutura que o YAGNI recomenda não construir antes de precisar.

### 2. Nenhum sistema de autenticação, apesar de já existir `id_usuario`

Em `modelo.js`, `cadastrar_pergunta` grava o autor da pergunta com um valor fixo:

```js
function cadastrar_pergunta(texto) {
  const params = [texto, 1];
  const result = bd.exec('INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta', params);
  return result.lastInsertRowid;
}
```

O schema já prevê `id_usuario`, mas o time não implementou login, sessões nem tabela de usuários completa — porque isso ainda não é necessário para o escopo atual. É um exemplo direto de YAGNI: o campo existe para uso futuro, mas a funcionalidade de autenticação não foi construída antes de haver uma necessidade concreta dela.

### 3. Modelo sem camada de DTOs/entidades

As funções de `modelo.js` retornam diretamente os objetos que vêm do banco (`bd.queryAll(...)`), sem convertê-los para classes de domínio ou DTOs intermediários, e `server.js` só repassa esse objeto na resposta HTTP:

```js
app.get('/', (req, res) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.send(perguntas);
  }
  ...
```

Criar classes de entidade (`Pergunta`, `Resposta`) com getters/setters só faria sentido se houvesse regras de negócio associadas a esses objetos. Como não há, a estrutura crua do banco sendo usada direto é a solução mais simples que resolve o problema atual.

### 4. Roteamento simples, sem camada de controllers separada

Todas as rotas estão direto em `server.js`, chamando funções de `modelo.js`. Não há uma camada adicional de controllers, nem um sistema de rotas modularizado em múltiplos arquivos. Com 4 rotas ao todo, dividir isso em mais camadas seria complexidade antecipada para um problema que ainda não existe.

## Oportunidades de simplificação / pontos de atenção

### 1. Duas funções de "reconfiguração" com nomes diferentes para o mesmo propósito

`modelo.js` expõe `reconfig_bd(mock_bd)` para testes, e `bd_utils.js` tem sua própria `reconfig(nome)`, que troca de banco por nome de arquivo. São mecanismos parecidos (permitir trocar a fonte de dados em teste) mas com nomes e assinaturas diferentes, o que exige guardar de cabeça qual delas faz o quê. Não é um caso de over-engineering, mas é uma pequena inconsistência que poderia ser resolvida com uma convenção de nomes única entre as duas camadas.

### 2. Consulta N+1 em `listar_perguntas`

```js
function listar_perguntas() {
  const perguntas = bd.queryAll('select * from perguntas', []);
  perguntas.forEach(pergunta => pergunta['num_respostas'] = get_num_respostas(pergunta['id_pergunta']));
  return perguntas;
}
```

Para cada pergunta retornada, `get_num_respostas` dispara uma nova query. Com poucas perguntas (como no ambiente didático atual) isso não é um problema perceptível, e resolver isso com uma única query (`JOIN` + `GROUP BY`) hoje seria otimização prematura para um volume de dados que não existe. Vale mencionar como ponto de atenção, não como algo a corrigir agora — outro exemplo de "não otimizar antes de precisar", só que aplicado a performance em vez de arquitetura.

## Conclusão

O código atual segue bem o design simples: sem ORM, sem autenticação não solicitada, sem camadas de abstração desnecessárias. O único ponto que vale observar é a duplicação de propósito entre `reconfig_bd` e `reconfig`, que é um problema de nomenclatura, não de complexidade excessiva.