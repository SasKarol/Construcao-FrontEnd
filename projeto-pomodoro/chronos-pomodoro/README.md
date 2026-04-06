# 📦 CSS com Escopo no React: CSS Modules

Nesta aula, vamos aprender a criar estilos com **escopo local**. Isso significa
que o CSS que escrevermos para um componente não vai "vazar" e afetar outros
elementos da página, evitando conflitos de classes. Faremos isso utilizando o
**CSS Modules**.

---

## 🏗️ 1. Criando e Organizando um Novo Componente

Para mantermos a organização, sempre que criarmos componentes menores que
compõem nossa interface, devemos agrupá-los em uma pasta específica.

1. Dentro de `src/`, crie uma pasta chamada `components/`.
2. Dentro dela, crie um arquivo chamado `Heading.jsx` (ou `.tsx`).

```jsx
// src/components/Heading.jsx
export function Heading() {
  return <h1>Olá, Mundo!</h1>;
}
```

3. Agora, vá até o seu App.jsx e importe o novo componente:

```jsx
// src/App.jsx
import { Heading } from './components/Heading';

export function App() {
  return (
    <>
      <Heading />
    </>
  );
}
```

## 🏷️ 2. A Propriedade className

No HTML padrão, usamos o atributo `class` para aplicar estilos. No React (JSX),
como a palavra `class` é reservada pelo JavaScript (para criar classes de POO),
devemos usar `className`.

```jsx
// Exemplo de aplicação de classe no JSX
<h1 className='titulo principal'>Olá, Mundo!</h1>
```

(No final, o React converte isso para o atributo `class` normal no HTML do
navegador).

## 🔒 3. O Problema do CSS Global e a Solução do CSS Modules

Se criarmos um arquivo Heading.css comum e definirmos
`.titulo { background: blue; }`, essa classe afetará qualquer elemento no
projeto que tenha a classe titulo. Em projetos grandes, isso gera muitos
conflitos!

A solução é usar o \* \* Para ativar o CSS Modules, basta nomear o arquivo de
estilo terminando com `.module.css`.

Crie o arquivo na mesma pasta do componente:

```plantext
src/components/
├── Heading.jsx
└── Heading.module.css
```

Adicione um estilo no arquivo `.module.css`:

```css
/* src/components/Heading.module.css */
.heading {
  background-color: brown;
  color: white;
}
.cyanText {
  color: cyan;
}
```

## 🔗 4. Aplicando o CSS Module no Componente

A forma de importar e usar um CSS Module é um pouco diferente do CSS Global. Nós
importamos o arquivo como se fosse um objeto JavaScript (geralmente damos o nome
de `styles`).

```javascript
// src/components/Heading.jsx
import styles from './Heading.module.css';

export function Heading() {
  // A classe 'heading' agora é acessada como uma propriedade do objeto 'styles'
  return <h1 className={styles.heading}>Olá, Mundo!</h1>;
}
```

🧐 **O que acontece por baixo dos panos?** Se você inspecionar a página no
navegador, verá que o React não gerou uma classe chamada heading, mas sim algo
como: `class="_Heading_heading_1a2b3"`

O CSS Modules cria esse "nome atrapalhado" (hash) automaticamente para garantir
que **essa classe seja única no projeto inteiro.** É assim que garantimos o
escopo!

## ➕ 5. Aplicando Múltiplas Classes

Se precisarmos aplicar mais de uma classe do CSS Module ao mesmo tempo, devemos
usar Template Literals (crases) do JavaScript para interpolar as strings.

```JavaScript
import styles from './Heading.module.css';

export function Heading() {
  return (
    <h1 className={`${styles.heading} ${styles.cyanText}`}>
      Olá, Mundo!
    </h1>
  );
}
```

## 🔌 Dica de Produtividade: Extensão para VS Code

Por padrão, o VS Code não sabe ler o que tem dentro do arquivo `.module.css` na
hora que você digita `styles`.

Para ter o recurso de autocompletar (IntelliSense) das suas classes, instale a
seguinte extensão no VS Code:

- **CSS Modules** (ou CSS Modules intellisense)

Com ela, ao digitar `styles.`, o editor mostrará uma lista com todas as classes
que você criou no arquivo CSS, evitando erros de digitação!
