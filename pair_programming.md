# Planejamento de Pair Programming

Este projeto está sendo desenvolvido individualmente. Como não há um par real disponível, descrevo abaixo como aplicaria a prática de pair programming caso tivesse um par para o desenvolvimento das 5 funcionalidades do ESM Forum.

## Estratégia

Dividiria o trabalho em sessões de pair programming focadas em uma funcionalidade por vez (não uma sessão única para o projeto inteiro), já que cada uma das 5 funcionalidades é relativamente independente e tem escopo pequeno o suficiente para ser pareada do início ao fim.

Para cada funcionalidade:

1. **Sessão de contexto (5-10 min)**: os dois leem juntos o trecho relevante do código existente (rota, modelo, view) antes de começar a escrever qualquer coisa, para alinhar entendimento do que já existe.
2. **Implementação em par**: driver e navigator trabalham juntos do design até o teste manual da funcionalidade.
3. **Revisão rápida ao final**: antes de mover o card para "Em Revisão", os dois releem o diff juntos.

## Ferramentas

- **VS Code Live Share**: para compartilhamento de tela e edição simultânea do código em tempo real, permitindo que os dois vejam e editem o mesmo arquivo.
- **Discord** (ou chamada de voz equivalente): para comunicação contínua durante a sessão, já que pair programming remoto depende de comunicação verbal constante entre driver e navigator.
- **GitHub Projects**: para manter o board sincronizado, movendo o card da funcionalidade para "Em Andamento" no início da sessão pareada.

## Rotação de Papéis (Driver/Navigator)

- Rotação a cada 20-25 minutos, para evitar que uma pessoa fique só escrevendo código e a outra só observando por longos períodos.
- O **driver** escreve o código e narra o raciocínio em voz alta.
- O **navigator** revisa em tempo real, aponta problemas de lógica, sugere nomes e estrutura, e mantém a visão do que falta implementar na funcionalidade.
- Ao trocar de papel, o novo driver resume o que entendeu do estado atual antes de continuar, como forma de validar que os dois estão alinhados (e não só um deles sabe o que está acontecendo).

## Por que essa divisão

Sessões curtas por funcionalidade, em vez de uma sessão pareada única e longa, reduzem o risco de fadiga e mantêm o foco alinhado com o board Kanban: cada card corresponde a um ciclo completo de pair programming, do início ao "Concluído".