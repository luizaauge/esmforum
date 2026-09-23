# Processo de Desenvolvimento — ESM Forum

## Escolha do Processo: Kanban

Optei por um board estilo **Kanban** em vez de Scrum para gerenciar o desenvolvimento das 5 funcionalidades solicitadas pelo cliente.

### Justificativa

O Scrum é organizado em torno de sprints de duração fixa, com cerimônias como planning, daily standup, review e retrospectiva, e pressupõe uma equipe trabalhando em ciclos iterativos ao longo de um período mais longo. Esse modelo faz sentido quando há um time maior, um backlog que evolui continuamente e necessidade de replanejamento frequente entre ciclos.

Este projeto tem características diferentes:

- É desenvolvido individualmente, sem necessidade de sincronizar múltiplos desenvolvedores em cerimônias formais.
- Tem um escopo fechado e conhecido de antemão: 5 funcionalidades específicas, sem backlog que cresce ao longo do tempo.
- Tem um prazo único e curto (até o final da Semana 3), o que não comporta a divisão em múltiplos sprints com retrospectivas entre eles.
- O valor de um board aqui é dar visibilidade ao fluxo de trabalho e evitar que várias tarefas fiquem "em andamento" ao mesmo tempo sem terminar nenhuma — que é exatamente o problema que o Kanban resolve, com seu foco em limitar trabalho em progresso (WIP) e visualizar o fluxo.

Por isso, o Kanban, com seu fluxo contínuo e colunas simples, é mais adequado: menos overhead de processo, mais foco em mover cada funcionalidade da entrada ao término.

## Estruturação do Board

### Colunas

| Coluna | Descrição |
|---|---|
| Backlog | Funcionalidades solicitadas pelo cliente, ainda não iniciadas |
| A Fazer | Próximas da fila, já com escopo definido |
| Em Andamento | Sendo implementadas no momento (limite de WIP: 1-2 cards) |
| Em Revisão | Implementação concluída, em revisão/teste manual |
| Concluído | Funcionalidade implementada e validada |

### Cards e Priorização

Ordem de prioridade das 5 funcionalidades, da mais alta para a mais baixa:

1. **Categorização de perguntas (tags)** — funcionalidade mais simples e que serve de base para a busca (perguntas categorizadas facilitam filtrar e buscar depois).
2. **Busca de perguntas por palavra-chave** — depende de ter dados estruturados (tags/conteúdo) para buscar; valor direto e imediato para o usuário.
3. **Sistema de votação em perguntas** — funcionalidade isolada, não depende das anteriores, mas exige alteração de schema (contagem de votos).
4. **Perfil de usuário com histórico** — depende de identificar o autor das perguntas/respostas de forma consistente, o que pode exigir mudanças mais amplas no modelo de dados.
5. **Notificação de novas respostas** — a mais complexa: depende de rastrear "quem perguntou o quê" (perfil) e de um mecanismo de notificação (e-mail, polling, etc.), por isso fica por último.

Cada uma das 5 funcionalidades tem um card próprio no board, na coluna Backlog, na ordem acima.