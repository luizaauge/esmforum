# Caso de Uso: Votar em Pergunta

**Atores:** Usuário do fórum

**Pré-condições:**
- Usuário está na tela de listagem de perguntas
- A pergunta que receberá o voto existe no banco de dados

**Fluxo Principal:**
1. Sistema exibe a lista de perguntas, cada uma com botões de upvote/downvote e o saldo de votos atual
2. Usuário clica no botão de upvote ou downvote de uma pergunta
3. Sistema verifica se o usuário já possui um voto registrado para essa pergunta
4. Sistema registra o novo voto associado ao usuário e à pergunta
5. Sistema recalcula o saldo de votos da pergunta
6. Sistema atualiza o saldo exibido na tela, sem recarregar a página inteira

**Fluxos Alternativos:**

**Fluxo Alternativo 1: Usuário já votou nesta pergunta com o mesmo tipo de voto**
3a. Sistema detecta que o voto já existe e é do mesmo tipo (upvote sobre upvote, ou downvote sobre downvote)
3b. Sistema remove o voto (o clique repetido funciona como "desfazer o voto")
3c. Sistema recalcula o saldo de votos
3d. Retorna ao passo 6 do fluxo principal

**Fluxo Alternativo 2: Usuário já votou nesta pergunta com o tipo oposto**
3a. Sistema detecta que existe um voto anterior de tipo diferente
3b. Sistema substitui o voto anterior pelo novo
3c. Sistema recalcula o saldo de votos
3d. Retorna ao passo 6 do fluxo principal

**Fluxo Alternativo 3: Falha ao registrar o voto**
4a. Ocorre um erro ao gravar o voto no banco (ex: falha de conexão)
4b. Sistema exibe uma mensagem de erro ao usuário
4c. Saldo de votos exibido permanece inalterado

**Pós-condições:**
- O voto do usuário para aquela pergunta está registrado no banco (ou removido, no caso do Fluxo Alternativo 1)
- O saldo de votos exibido na tela reflete o estado atual do banco de dados