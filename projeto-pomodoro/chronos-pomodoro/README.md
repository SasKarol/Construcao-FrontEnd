# 🤔 Onde colocar o Estado da Aplicação? (Elevação de Estado)

Nesta aula, demos uma pausa no código para entender um dos conceitos mais
cruciais do React: **Onde o Estado (State) deve morar?** Quando criamos a
mudança de temas (Dark/Light), o estado vivia tranquilamente dentro do
componente `Menu`, porque apenas ele e o arquivo HTML precisavam saber dessa
informação. Mas agora, com o `TaskStateModel` que criamos na aula anterior, o
buraco é mais embaixo.

---

## 🗺️ O Mapa das Dependências

Vamos analisar quem precisa saber das informações do nosso timer:

1. **`tasks` (O Histórico):**
   - A página de Histórico (para listar as tarefas).
   - O formulário da Home (para adicionar uma nova tarefa à lista quando o
     usuário der o play).
2. **`secondsRemaining` e `activeTask` (O Timer):**
   - O componente `Countdown` (para mostrar os números diminuindo).
   - O formulário (para saber se o botão deve ser "Iniciar" ou "Interromper").
   - O `<title>` da página (para mostrar o tempo na aba do navegador).
3. **`config` (As Configurações de Tempo):**
   - A página de Configurações (para o usuário alterar os valores).
   - O Timer (para saber de quanto tempo ele deve começar a contagem
     regressiva).

---

## 🏗️ O Problema do Fluxo de Dados no React

No React, o fluxo de dados é **Unidirecional (Top-Down)**. Isso significa que a
informação flui como uma cachoeira: de cima (Pai) para baixo (Filho), através
das `props`.

- Um componente Pai pode passar dados para o Filho.
- Um componente Filho **não pode** passar dados diretamente para um "componente
  irmão" (ex: o `Countdown` não consegue enviar dados direto para o `MainForm`).

### A Solução: Elevação de Estado (Lifting State Up)

Se dois ou mais componentes precisam do mesmo estado, nós precisamos "elevar"
esse estado até o componente que seja Pai de ambos.

No nosso caso, como a página `Home` (que tem o timer) e a página `History` (que
tem a lista) precisam dos mesmos dados, o estado não pode morar dentro da
`Home`. Ele precisa morar um nível acima!

Por enquanto, o componente que está acima de todas as páginas é o nosso
**`App.tsx`**.

---

## 🚀 O Plano de Ação (Próximas Aulas)

1. **A Dor (Prop Drilling):** Primeiramente, vamos criar nosso estado gigante
   dentro do `App.tsx` e ir passando ele via `props` (propriedades) por várias
   camadas: do `App` para a `Home`, da `Home` para o `MainForm`, do `MainForm`
   para o `Button`. Isso vai gerar um código bem poluído e difícil de manter.
2. **O Remédio (Context API):** Depois de sentirmos essa dor na prática, vamos
   aprender a melhor forma de resolver isso no React: criando um **Contexto**. O
   Contexto funciona como uma "nuvem" de dados na nossa aplicação; qualquer
   componente, não importa o quão fundo ele esteja na árvore, pode acessar a
   nuvem diretamente sem precisar de repasses intermináveis de `props`.

---

Prepare-se, porque na próxima aula vamos começar a construir o motor do nosso
timer dentro do `App.tsx`!
