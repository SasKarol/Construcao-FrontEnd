# 🎛️ Finalizando o Input: Textos Dinâmicos e Operador Rest/Spread

Nesta aula, vamos continuar evoluindo o nosso componente `DefaultInput`. O
objetivo agora é tornar o texto da `<label>` dinâmico e garantir que nosso
componente aceite **qualquer propriedade** que um input HTML nativo aceita, sem
precisarmos declará-las uma por uma.

---

## 🏷️ 1. Tornando o Texto da Label Dinâmico

O nosso input ainda está com a label fixada como "task". Vamos criar uma nova
propriedade chamada `labelText` para que possamos alterar esse texto quando
formos usar o componente.

**Arquivo:** `src/components/DefaultInput/index.tsx`

```tsx
type DefaultInputProps = {
  id: string;
  labelText: string; // Nova propriedade adicionada!
} & React.ComponentProps<'input'>;
```

## 💡 Parênteses Rápido: Condicionais no JSX

Durante a aula, exploramos a ideia de tornar o `labelText` opcional (adicionando
um `?` no tipo: `labelText?: string`). Se ele fosse opcional, não poderíamos
renderizar uma tag `<label>` vazia no HTML.

Para resolver isso, usamos **Renderização Condicional** com o operador `&&` do
JavaScript dentro do JSX:

```tsx
// Se labelText existir, renderiza a tag. Se não existir, não faz nada.
{
  labelText && <label htmlFor={id}>{labelText}</label>;
}
```

_Observação: Decidimos voltar atrás e deixar o `labelText` obrigatório, pois no
layout do nosso projeto todos os inputs possuem uma label. Mas é essencial
conhecer essa técnica de condicional!_

## 🎭 2. O Poder do Operador Rest/Spread (`...rest`)

Nossa tipagem com `React.ComponentProps<'input'>` já informa ao TypeScript que
nosso componente aceita propriedades como `disabled`, `required`, `placeholder`,
etc.

Porém, se passarmos essas propriedades lá no `App.tsx`, elas não vão chegar na
tag `<input>` real do HTML, porque não as conectamos dentro do nosso componente.

Para não precisarmos declarar dezenas de propriedades nas props, usamos o
operador **Rest** (`...rest`) na desestruturação, e o operador **Spread**
({`...rest`}) na tag HTML.

**Como funciona:**

1. Extraímos o `id`, `type` e `labelText` para usarmos explicitamente.
2. Agrupamos "todo o resto" (rest) das propriedades dentro de um objeto chamado
   rest.
3. Despejamos (spread) esse objeto diretamente na tag `<input>`.

**Arquivo:** `src/components/DefaultInput/index.tsx`

```tsx
import React from 'react';

type DefaultInputProps = {
  id: string;
  labelText: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({
  id,
  type,
  labelText,
  ...rest // 1. Pega todas as outras propriedades (disabled, required, etc)
}: DefaultInputProps) {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      {/* 2. Despeja o restante das propriedades direto no input */}
      <input id={id} type={type} {...rest} />
    </>
  );
}
```

## 🚀 3. Testando o Novo Input

Agora podemos ir no nosso `App.tsx` e usar o componente de forma completa. Tente
adicionar atributos nativos do HTML como `disabled` ou `required` para ver a
mágica do `...rest` funcionando!

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';

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

      <Container>
        <form className='form' action=''>
          <div className='formRow'>
            {/* Agora passamos o labelText e podemos passar qualquer prop nativa! */}
            <DefaultInput
              id='meuInput'
              type='text'
              labelText='task'
              /* Tente adicionar: disabled ou placeholder="Digite algo" */
            />
          </div>

          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className='formRow'>
            <p>Ciclos</p>
            <p>0 0 0 0 0 0 0</p>
          </div>

          <div className='formRow'>
            <button>Enviar</button>
          </div>
        </form>
      </Container>
    </>
  );
}
```
