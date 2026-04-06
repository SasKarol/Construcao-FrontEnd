# 🪝 Dominando Efeitos Colaterais com o `useEffect`

Na aula passada, vimos que manipular o DOM diretamente ou buscar dados externos
(ações que o React não monitora nativamente) são considerados **Efeitos
Colaterais**. Tentar fazer isso diretamente no corpo do componente ou dentro de
um `setState` causa bugs de assincronicidade ou quebra as regras do React.

Para resolver isso, o React nos fornece um Hook específico: o `useEffect`.

---

## 🛠️ 1. As Três Formas de Usar o `useEffect`

O `useEffect` recebe dois parâmetros:

1. Uma função (o efeito em si que você quer executar).
2. Um array de dependências (opcional), que dita **quando** esse efeito deve
   rodar.

Dependendo de como você passa esse array, o `useEffect` se comporta de três
maneiras diferentes.

### A) Sem Array de Dependências (Cuidado! ⚠️)

Se você não passar o segundo parâmetro, a função executará **toda vez que o
componente for renderizado**.

```tsx
useEffect(() => {
  console.log(
    'Executado toda vez que qualquer estado/prop mudar e o componente renderizar',
  );
});
```

_Geralmente evitamos essa forma, pois se um componente renderiza muito, seu
efeito colateral (como uma chamada de API) vai rodar repetidas vezes sem
necessidade, travando a aplicação._

**B) Com Array de Dependências Vazio `[]` (O "On Mount")** Se você passar um
array vazio, você está dizendo ao React: _"Esse efeito não depende de nenhuma
variável para atualizar"_. Portanto, ele só vai executar **uma única vez**, logo
após o componente ser montado (aparecer na tela) pela primeira vez.

```tsx
useEffect(() => {
  console.log('Executa APENAS uma vez, quando o componente é montado na tela');
}, []);
```

_Muito útil para buscar os dados iniciais de uma API logo que o usuário entra na
página._

**C) Com Variáveis no Array de Dependências (O que usaremos! ✅)** Se você
passar uma variável dentro do array, o React vai observar essa variável. O
efeito será executado na primeira renderização E **toda vez que essa variável
específica mudar de valor**.

```tsx
useEffect(() => {
  console.log('O tema mudou para:', theme);
  // É AQUI o lugar correto para manipular o DOM com o valor atualizado!
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]); // O efeito "escuta" o estado `theme`
```

Dessa forma, resolvemos nosso problema de atraso! Agora, sempre que o botão de
tema for clicado, o estado `theme` muda. O React percebe a mudança, renderiza a
tela e, só depois disso, aciona nosso `useEffect` passando o valor já atualizado
para o HTML.

## 🧹 2. A Função de Limpeza (Clean-up Function)

E se o nosso efeito colateral for iniciar um cronômetro (`setInterval`) ou
adicionar um ouvinte de eventos global (`addEventListener`)? Se o componente for
destruído (o usuário mudar de página, por exemplo), esse cronômetro continuará
rodando em background, causando vazamento de memória e travamentos (a "sujeira"
da qual falamos).

Para evitar isso, o `useEffect` permite que você retorne uma função de dentro
dele. Essa é a **Clean-up Function** (Função de Limpeza).

```tsx
useEffect(() => {
  // 1. O efeito roda e cria algo (ex: um setInterval)

  return () => {
    // 2. O React engatilha essa função e a executa ANTES de rodar
    // o efeito novamente ou ANTES de destruir o componente da tela.
    // Aqui é onde você limpa a "sujeira" (ex: clearInterval).
    console.log('Limpando o efeito anterior antes de atualizar...');
  };
}, [theme]);
```

**O Ciclo de Vida do nosso Menu ao clicar no botão:**

1. Você clica e muda o `theme` para `light`.
2. O React prepara para rodar o `useEffect` com o novo valor.
3. ANTES disso, ele roda a função de limpeza (o `return`) do `useEffect`
   anterior (que ainda era `dark`).
4. Ele roda o novo `useEffect` aplicando o tema `light` no HTML.

## 🚀 3. O Código Final do Menu

Aqui está o código atualizado do nosso componente Menu, aplicando o `useEffect`
da maneira correta e removendo a "gambiarra" da aula passada.

**Arquivo:** `src/components/Menu/index.tsx`

```tsx
import { HistoryIcon, HouseIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const [theme, setTheme] = useState<AvailableThemes>('dark');

  // A função de clique agora apenas muda o estado. Ponto.
  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();

    setTheme(prevTheme => {
      return prevTheme === 'dark' ? 'light' : 'dark';
    });
  }

  // O Efeito Colateral que escuta o estado e reflete no HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Função de limpeza (apenas didática neste momento)
    return () => {
      console.log('Limpando efeito anterior...');
    };
  }, [theme]); // Array de dependências observando o 'theme'

  return (
    <nav className={styles.menu}>
      {/* ... JSX dos links (inalterado) ... */}

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      >
        <SunIcon />
      </a>
    </nav>
  );
}
```

Nosso alternador de tema está funcionando perfeitamente sem atrasos! No entanto,
se o usuário recarregar a página (F5), o tema volta para o `dark`, pois o estado
é reiniciado.
