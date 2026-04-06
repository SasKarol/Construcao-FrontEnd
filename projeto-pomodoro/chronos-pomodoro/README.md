# 🤔 O Problema das Variáveis Comuns: Introdução ao Estado no React

Nesta aula, damos o nosso primeiro passo para entender o Hook mais famoso do
React: o `useState`.

Porém, antes de aprendermos a usar a ferramenta, precisamos entender **qual
problema ela resolve**. Se você já domina o `useState`, sinta-se à vontade para
pular para a próxima aula. Se não, preste muita atenção, pois esse conceito é a
base de tudo no React!

---

## 🧪 1. O Experimento: Variáveis Comuns e Eventos

Imagine que queremos ter um contador numérico na nossa tela. A lógica mais
instintiva para quem vem do JavaScript puro é criar uma variável
(`let numero = 0`) e uma função para somar `+1` a ela quando clicarmos em um
botão.

No React, os eventos do HTML (como `onclick`, `onchange`) são escritos em
camelCase (`onClick`, `onChange`).

**O que fizemos no código:**

1. Criamos um `<Heading>` para exibir o número.
2. Criamos um `<button>` com o evento `onClick`.
3. Passamos a **referência** da função `handleClick` para o botão (sem os
   parênteses `()`, pois não queremos executá-la na hora, apenas quando o clique
   acontecer).
4. Usamos a variável `numero` no nosso `<DefaultInput>` como `labelText`.

```tsx
export function App() {
  let numero = 0; // Nossa variável comum

  function handleClick() {
    numero += 1; // Somando +1
    console.log(numero); // O console mostra o número atualizado!
  }

  return (
    <>
      <Heading>Número: {numero}</Heading>
      <button onClick={handleClick}>Aumenta</button>
      {/* ... outros componentes ... */}
      <DefaultInput labelText={numero.toString()} id='meuInput' type='text' />
    </>
  );
}
```

### ❌ O Problema

Ao clicar no botão, o `console.log` mostra que o número está aumentando (1, 2,
3...). Porém, a tela continua mostrando 0. Por que isso acontece? Porque o React
não fica monitorando variáveis comuns. Ele não sabe que a variável numero mudou
e, portanto, não atualiza (não renderiza novamente) a interface.

## 🛠️ 2. A Solução "Gambiarra" (JavaScript Puro)

Para provar que a variável está mudando, tentamos forçar a atualização da tela
usando JavaScript puro (`document.getElementById`).

Colocamos um `id="numero"` no nosso span e alteramos a função:

```tsx
function handleClick() {
  const span = document.getElementById('numero');
  if (!span) return;

  numero += 1;
  span.innerText = numero.toString(); // Forçando a mudança no DOM
  console.log(numero, Date.now());
}
```

## 🚨 O Efeito Colateral e a Dessincronização

Ao fazer isso, o número dentro do `<Heading>` passa a atualizar na tela! Mas
veja o que aconteceu com o nosso `<DefaultInput>` lá embaixo: a label dele
**continua travada no 0**.

**Isso se chama Dessincronização de Interface.** Estamos manipulando o DOM
diretamente (o que chamamos de _Efeito Colateral_, pois ocorre por fora do
controle do React). O React não sabe o que está acontecendo. Atualizamos um
lugar "na força bruta", mas o resto do aplicativo que depende dessa variável
continua desatualizado.

## 💡 3. A Conclusão: Precisamos de um Estado!

Se você usar variáveis comuns (`let`, `const`, `var`), o React não vai atualizar
os componentes na tela quando elas mudarem. E se você usar
`document.getElementById`, vai quebrar a sincronia do seu aplicativo e lutar
contra a própria arquitetura do React.

**A regra de ouro:** Se um dado precisa mudar e essa mudança precisa refletir
visualmente na tela em um ou mais componentes, esse dado **não pode ser uma
variável comum. Ele precisa ser um ESTADO.**

Na próxima aula, vamos apagar esse código manual do JavaScript e introduzir o
useState, que é a forma oficial de dizer ao React: _"Ei, monitore esse valor
para mim e atualize tudo automaticamente quando ele mudar!"_

**Código temporário utilizado na aula** (`src/App.tsx`): _(Nota: Este código
contém a manipulação manual do DOM apenas para fins didáticos e será refatorado
na próxima aula)._

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import './styles/theme.css';
import './styles/global.css';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton';
import { PlayCircleIcon } from 'lucide-react';
import { Footer } from './components/Footer';
import { Heading } from './components/Heading';

export function App() {
  let numero = 0;

  function handleClick() {
    const span = document.getElementById('numero');

    if (!span) return;

    numero += 1;
    span.innerText = numero.toString();
    console.log(numero, Date.now());
  }

  return (
    <>
      <Heading>
        Número: <span id='numero'>{numero}</span>
      </Heading>
      <button onClick={handleClick}>Aumenta</button>

      <Container>
        <Logo />
      </Container>
      <Container>
        <Menu />
      </Container>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <form className='form' action=''>
          <div className='formRow'>
            <DefaultInput
              labelText={numero.toString()}
              id='meuInput'
              type='text'
              placeholder='Digite algo'
            />
          </div>

          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className='formRow'>
            <Cycles />
          </div>

          <div className='formRow'>
            <DefaultButton icon={<PlayCircleIcon />} />
          </div>
        </form>
      </Container>

      <Container>
        <Footer />
      </Container>
    </>
  );
}
```
