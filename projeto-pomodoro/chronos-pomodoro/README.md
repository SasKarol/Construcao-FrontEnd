# 📂 Organizando Componentes com Pastas e Index

À medida que o nosso projeto cresce, a quantidade de arquivos também aumenta. Um
único componente pode precisar de um arquivo JSX/TSX, um arquivo CSS, um arquivo
de testes, um arquivo de histórias (Storybook), etc. Se deixarmos tudo solto na
pasta `src/components`, rapidamente teremos uma bagunça!

Nesta aula, vamos adotar uma arquitetura de pastas muito comum e profissional no
mundo React.

---

## 🏗️ 1. A Estrutura de Pastas por Componente

Em vez de ter arquivos soltos, vamos criar uma pasta para **cada componente**. O
nome da pasta será o nome do componente (em PascalCase).

Vamos reestruturar o nosso `<Container />` e o nosso `<Heading />`.

1. Dentro de `src/components/`, crie uma pasta chamada `Container`.
2. Mova os arquivos do Container para dentro desta pasta.
3. Repita o processo criando uma pasta `Heading` e movendo os arquivos do
   Heading para lá.

A sua estrutura ficará assim:

```text
src/
└── components/
    ├── Container/
    │   ├── Container.tsx
    │   └── Container.module.css
    └── Heading/
        ├── Heading.tsx
        └── Heading.module.css
```

## 🪄 2. O Padrão `index.tsx` (O Truque de Mestre)

Se deixarmos a estrutura como está acima, na hora de importar o componente no
`App.tsx`, o caminho ficará redundante e feio:

```tsx
// ❌ Caminho redundante
import { Container } from './components/Container/Container';
```

Para resolver isso de forma elegante, vamos **renomear** o arquivo principal do
componente (o `.tsx` ou `.jsx`) para `index.tsx`.

O Node.js e o Vite são inteligentes: quando você aponta a importação para uma
pasta, eles automaticamente procuram por um arquivo chamado `index` dentro dela.

1. Renomeie `Container.tsx` para `index.tsx`.
2. Renomeie `Heading.tsx` para `index.tsx`.

Agora a importação fica limpa!

```jsx
// ✅ O Vite procura automaticamente o index.tsx dentro da pasta Container!
import { Container } from './components/Container';
```

## 🎨 3. Padronizando o nome do CSS

Para facilitar ainda mais (especialmente quando quisermos copiar e colar uma
pasta para criar um novo componente rapidamente), vamos padronizar o nome do
arquivo CSS de todos os nossos componentes.

Em vez de `Container.module.css` ou `Heading.module.css`, vamos chamar
simplesmente de `styles.module.css` dentro da pasta de cada componente.

A estrutura final perfeita de um componente ficará assim:

```plan
src/components/Container/
├── index.tsx          # A lógica e o JSX do componente
└── styles.module.css  # O estilo isolado do componente
```

## 📝 4. Como Ficaram Nossos Arquivos Finais?

Com a mudança do nome do arquivo CSS, não podemos esquecer de atualizar as
nossas importações dentro de cada `index.tsx`. Veja como ficam os códigos finais
dos nossos dois componentes já refatorados:

**Componente Heading** **Arquivo:** `src/components/Heading/index.tsx`

```tsx
import styles from './styles.module.css';

type HeadingProps = {
  children: React.ReactNode;
};

export function Heading({ children }: HeadingProps) {
  return <h1 className={styles.heading}>{children}</h1>;
}
```

**Componente Container** **Arquivo:** `src/components/Container/index.tsx`

```tsx
import styles from './styles.module.css';

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

## ⚙️ 5. Dica de Produtividade no VS Code

Quando você tiver dezenas de componentes, você terá dezenas de abas abertas no
VS Code chamadas apenas `index.tsx`. Isso pode ser muito confuso!

Para resolver isso, podemos configurar o VS Code para mostrar o nome da pasta
pai ao lado do nome do arquivo na aba.

1. Na raiz do projeto, crie ou abra a pasta `.vscode`.
2. Abra o arquivo `settings.json` (se não existir, pode criar).
3. Adicione a seguinte configuração:

```json
{
  "workbench.editor.labelFormat": "short"
}
```

Agora, as abas do seu VS Code mostrarão algo como `index.tsx Container` ou
`index.tsx Heading`, facilitando muito a navegação!

💡 **Dica Extra:** Use o atalho `Ctrl + P` (ou `Cmd + P` no Mac) para buscar
arquivos rapidamente pelo nome da pasta. Ex: digite "container" e o VS Code
mostrará o `index.tsx` e o `styles.module.css` daquela pasta.
