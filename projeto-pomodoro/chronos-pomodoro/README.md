# 📝 Estruturando o Formulário Inicial

Bora para o próximo passo! Agora vamos criar a estrutura do formulário que
ficará logo abaixo do nosso cronômetro.

Em vez de criarmos vários componentes separados logo de cara, vamos adotar uma
estratégia muito comum: **primeiro vamos montar toda a estrutura HTML/JSX
diretamente no arquivo principal (`App.tsx`) e adicionar um CSS global
temporário.** Quando o layout base estiver funcionando, nós começamos a extrair
as partes para componentes isolados.

---

## 🏗️ 1. A Estrutura de "Linhas" (FormRow)

Para organizar o formulário, vamos agrupar os elementos em "caixas" ou "linhas"
verticais. Cada grupo (como o input + label, ou os textos descritivos) ficará
dentro de uma `<div>` com a classe `formRow`.

### 💡 Dicas de Ouro desta etapa:

1. **Acessibilidade:** Sempre conecte a sua `<label>` ao seu `<input>`. No
   React, usamos a propriedade `htmlFor` na label apontando para o `id` do
   input. Assim, se o usuário clicar no texto da label, o input já ganha o foco
   automaticamente!
2. **Produtividade no VS Code:** Precisa de um texto de preenchimento (dummy
   text) rápido? Digite `lorem5` e aperte `Tab`. O VS Code vai gerar exatamente
   5 palavras de texto _Lorem Ipsum_ para você.

---

## 📝 2. Criando o Formulário no App.tsx

Vamos adicionar mais um `<Container />` no final do nosso `App.tsx` e colocar a
estrutura do formulário dentro dele.

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <>
      <Container>
        <Logo />
      </Container>

      <Container>
        <Menu />
      </Container>

      <Container>
        <CountDown />
      </Container>

      {/* Nossa nova estrutura de formulário */}
      <Container>
        <form className='form' action=''>
          {/* Grupo 1: Label e Input */}
          <div className='formRow'>
            <label htmlFor='meuInput'>task</label>
            <input id='meuInput' type='text' />
          </div>

          {/* Grupo 2: Texto de apoio */}
          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          {/* Grupo 3: Ciclos */}
          <div className='formRow'>
            <p>Ciclos</p>
            <p>0 0 0 0 0 0 0</p>
          </div>

          {/* Grupo 4: Botão */}
          <div className='formRow'>
            <button>Enviar</button>
          </div>
        </form>
      </Container>
    </>
  );
}
```

## 🎨 3. Estilização Base (Temporária)

Como os nossos elementos dentro do formulário e das "linhas" precisam ficar
centralizados e empilhados (um embaixo do outro), vamos usar muito o nosso amigo
**Flexbox**.

Por enquanto, vamos colocar essas classes no nosso CSS Global. Em aulas futuras,
moveremos isso para os estilos de seus próprios componentes.

Abra o seu arquivo global e adicione as classes `.form` e `.formRow` no final:

**Arquivo:** `src/styles/global.css`

```css
/* ... resto do seu código global (reset, body, html) ... */

/* Centralizando e empilhando os itens do formulário */
.form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2.4rem;
}

/* O mesmo alinhamento para o conteúdo interno de cada "linha" */
.formRow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2.4rem;
}
```

Se você olhar no navegador agora, verá que a estrutura básica e os espaçamentos
já estão lá! O visual dos botões e inputs ainda está com o padrão feio do
navegador, mas o esqueleto centralizado está pronto.
