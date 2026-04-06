# 🎣 Introdução ao `useState`: A Magia da Reatividade

Na aula passada, vimos que variáveis comuns não são capazes de avisar o React
quando seus valores mudam, causando a dessincronização da interface.

Nesta aula, vamos resolver esse problema utilizando o nosso primeiro **Hook**: o
`useState`. Ele é a ferramenta oficial do React para criar variáveis que a
interface "escuta" e reage automaticamente.

---

## 🧩 1. O que é um Hook e como usar o `useState`?

No React, qualquer função que comece com a palavra `use` (como `useState`,
`useEffect`, etc.) é chamada de **Hook**.

O `useState` recebe um valor inicial e retorna um _array_ com exatamente duas
posições:

1. O valor atual do estado.
2. Uma função para atualizar esse valor.

Para facilitar, usamos a **desestruturação de arrays** do JavaScript para pegar
esses dois valores em uma única linha:

```tsx
import { useState } from 'react';

// Sintaxe: const [estado, setEstado] = useState(valorInicial);
const [numero, setNumero] = useState(0);
```

**A Regra de Ouro do Estado:** Você **NUNCA** deve alterar o estado diretamente
usando o sinal de igual (ex: `numero = 1`). Você deve **SEMPRE** usar a função
atualizadora (ex: `setNumero(1)`). É essa função que avisa o React: _"Ei, o
valor mudou, atualize a tela!"_.

## 🔄 2. O Poder da Programação Reativa

Ao trocarmos a nossa variável comum pelo `useState`, a mágica acontece. Veja
como fica a nossa função de clique:

```tsx
function handleClick() {
  // O React automaticamente atualiza o <Heading> e o <DefaultInput> na tela!
  setNumero(1);
}
```

Não precisamos mais buscar IDs ou manipular o DOM manualmente. O React monitora
a variável `numero` e, sempre que o `setNumero` for chamado, **todos os
componentes que utilizam essa variável serão renderizados novamente** com o novo
valor. Isso é o que chamamos de Programação Reativa.

## 🧠 3. Atualizando com base no Estado Anterior (`prevState`)

Se você precisar atualizar um estado baseando-se no valor que ele tinha antes
(como em um contador numero + 1), é altamente recomendado usar uma função de
callback dentro do `setNumero`.

❌ O Jeito Frágil Se você fizer setNumero(`numero + 1`) três vezes seguidas, o
React pode agrupar essas chamadas para otimizar a performance, e o número pode
subir apenas 1 vez.

✅ **O Jeito Seguro** Ao passar uma função para o `setNumero`, o React injeta o
valor mais recente do estado no parâmetro dessa função (geralmente chamamos de
`prevState`).

```tsx
function handleClick() {
  // Se chamarmos isso 3 vezes, ele vai somar 3 corretamente,
  // pois sempre olha para o estado exato daquele milissegundo.
  setNumero(prevState => prevState + 1);
  setNumero(prevState => prevState + 1);
  setNumero(prevState => prevState + 1);
}
```

## 🦥 4. Lazy Initialization (Inicialização Preguiçosa)

E se o valor inicial do seu estado vier de um cálculo muito pesado e demorado?
Se passarmos direto para o `useState(calculoPesado())`, o React fará esse
cálculo em **toda** renderização da tela, travando o app.

Para evitar isso, passamos uma função anônima para dentro do `useState`. Assim,
o React só vai executar esse bloco de código **uma única vez**, na primeira vez
que o componente for montado na tela.

```tsx
const [numero, setNumero] = useState(() => {
  console.log(
    'Lazy initialization: Executa cálculos pesados apenas na 1ª vez!',
  );
  // O retorno dessa função será o valor inicial do estado
  return 0;
});
```

## 🚀 5. Aplicando no App.tsx

Aqui está o código final dos nossos testes para você validar como o estado se
propaga pela árvore de componentes.

**Arquivo:** `src/App.tsx`

```tsx
import { useState } from 'react';
import { Heading } from './components/Heading';
import { DefaultInput } from './components/DefaultInput';
import { DefaultButton } from './components/DefaultButton';
import { PlayCircleIcon } from 'lucide-react';
// ... outros imports

export function App() {
  // Criando nosso estado
  const [numero, setNumero] = useState(0);

  // Função que atualiza o estado usando o prevState
  function handleClick() {
    setNumero(prevState => prevState + 1);
  }

  return (
    <>
      {/* O Heading consome o estado */}
      <Heading>Número: {numero}</Heading>

      <button onClick={handleClick}>Aumenta</button>

      {/* ... containers ... */}

      <form className='form' action=''>
        <div className='formRow'>
          {/* O Input também consome o estado */}
          <DefaultInput
            labelText={numero.toString()}
            id='meuInput'
            type='text'
            placeholder='Digite algo'
          />
        </div>

        {/* ... restante do form ... */}
      </form>
    </>
  );
}
```

Agora que dominamos o básico do `useState` em um ambiente controlado, chegou a
hora de aplicá-lo em um cenário real da nossa aplicação.
