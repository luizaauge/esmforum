# Histórias de Usuário

## História 1: Categorização de Perguntas por Tags

**Como** usuário do fórum,
**Eu quero** categorizar minhas perguntas com tags (tecnologia, carreira, dúvidas-gerais, etc.),
**Para** que outros usuários encontrem perguntas do assunto que interessa a eles com mais facilidade.

**Critérios de Aceitação:**
- [ ] Ao cadastrar uma pergunta, o usuário pode escolher uma ou mais tags de uma lista pré-definida
- [ ] A tag escolhida fica visível junto à pergunta na listagem
- [ ] É possível filtrar a listagem de perguntas por uma tag específica
- [ ] Uma pergunta pode ter mais de uma tag associada
- [ ] Perguntas sem tag continuam aparecendo normalmente na listagem geral

## História 2: Busca de Perguntas por Palavra-Chave

**Como** usuário do fórum,
**Eu quero** buscar perguntas digitando uma palavra-chave,
**Para** encontrar rapidamente perguntas sobre um assunto específico sem precisar ler a lista inteira.

**Critérios de Aceitação:**
- [ ] Existe um campo de busca visível na tela de listagem de perguntas
- [ ] A busca retorna perguntas cujo texto contenha a palavra-chave digitada
- [ ] A busca não diferencia maiúsculas de minúsculas
- [ ] Se nenhuma pergunta corresponder à busca, o sistema exibe uma mensagem indicando que não há resultados
- [ ] Limpar o campo de busca volta a exibir todas as perguntas

## História 3: Sistema de Votação em Perguntas

**Como** usuário do fórum,
**Eu quero** votar em perguntas (upvote/downvote),
**Para** destacar perguntas úteis e relevantes para a comunidade.

**Critérios de Aceitação:**
- [ ] Cada pergunta exibe botões de upvote e downvote e o saldo de votos atual
- [ ] O contador de votos é atualizado imediatamente após o voto
- [ ] O usuário pode trocar seu voto (de upvote para downvote e vice-versa)
- [ ] O usuário não pode registrar mais de um voto ativo na mesma pergunta
- [ ] A listagem de perguntas pode ser ordenada pelo saldo de votos

## Priorização

1. **Categorização por Tags**
2. **Busca por Palavra-Chave**
3. **Votação em Perguntas**

### Justificativa

Tags vêm primeiro porque são a funcionalidade mais simples de implementar (só exige adicionar um campo/tabela e uma tela de seleção) e porque a busca se beneficia diretamente dela — perguntas já categorizadas facilitam tanto a busca textual quanto a futura filtragem por assunto.

Busca por palavra-chave vem em seguida porque entrega valor direto e imediato ao usuário (resolve o problema de "achar o que já foi perguntado antes"), e é natural implementá-la logo depois de ter as perguntas categorizadas.

Votação fica em terceiro porque, embora seja uma funcionalidade isolada (não depende de tags nem de busca), envolve mudanças mais profundas no schema (registrar quem votou em quê, para impedir voto duplicado) e mexe em uma regra de negócio mais complexa que as duas anteriores.