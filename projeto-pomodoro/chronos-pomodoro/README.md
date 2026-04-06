# 🧭 Criando o Componente de Menu (Navegação)

Nesta aula, vamos acelerar um pouco o passo! Como já entendemos a lógica de
criação e estilização de componentes, vamos usar nossos truques de produtividade
para construir o nosso Menu de navegação.

---

## 🔧 1. Pequeno Ajuste na Logo

Antes de criarmos o Menu, vamos dar um pequeno ajuste no efeito de _hover_ da
nossa Logo. Na aula anterior, colocamos o `brightness` em `50%`, mas ficou uma
mudança um pouco drástica.

Vamos suavizar isso no arquivo `src/components/Logo/styles.module.css`:

```css
/* Antes era 50%, mude para 80% */
.logoLink:hover {
  filter: brightness(80%);
}
```

## 🚀 2. Criando o Componente Menu

Para ganhar tempo, vamos usar a mesma técnica da aula passada:

1. Copie a pasta do componente `Logo`.
2. Cole e renomeie a nova pasta para `Menu`.
3. Use o _Find & Replace_ (`Ctrl + F`) com a opção Preserve Case (`Aa`) ativada
   para trocar todas as palavras `Logo` por Menu (e `logo` por `menu`).

Nosso Menu será uma barra de navegação (`<nav>`) contendo quatro botões de ação
principais. Para os ícones, usaremos novamente o `lucide-react`.

💡 **Dica de Ouro:** Repare que importamos os ícones com o sufixo `Icon` (ex:
`SettingsIcon`). Fazemos isso para evitar conflitos de nomes. Se no futuro
criarmos uma página chamada `Settings`, o nome não vai colidir com o ícone!

**Arquivo:** `src/components/Menu/index.tsx`

```tsx
import { HistoryIcon, HouseIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';

export function Menu() {
  return (
    <nav className={styles.menu}>
      {/* Futuramente, trocaremos a tag <a> por componentes de Link de um Router */}
      <a className={styles.menuLink} href='#'>
        <HouseIcon />
      </a>

      <a className={styles.menuLink} href='#'>
        <HistoryIcon />
      </a>

      <a className={styles.menuLink} href='#'>
        <SettingsIcon />
      </a>

      <a className={styles.menuLink} href='#'>
        <SunIcon />
      </a>
    </nav>
  );
}
```

## 🎨 3. Estilizando o Menu

Diferente da Logo, os links do nosso Menu terão um fundo colorido (usando nossa
variável `--primary`) e as bordas arredondadas.

Abra o arquivo de estilos do Menu e limpe os códigos antigos da Logo para
colocarmos os novos:

**Arquivo:** `src/components/Menu/styles.module.css`

```css
.menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
}

.menuLink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: var(--primary);
  /* A cor do ícone recebe a cor feita para contrastar com o primary */
  color: var(--text-over-primary);
  transition: all 0.1s ease-in-out;
  padding: 1.2rem;
  border-radius: 0.8rem;
}

.menuLink:hover {
  filter: brightness(80%);
}

.menuLink svg {
  width: 2.4rem;
  height: 2.4rem;
}
```

## 🧩 4. Adicionando o Menu ao App

Para finalizar, vamos importar o nosso novo Menu no `App.tsx` e colocá-lo dentro
de um `<Container />` para manter o nosso layout perfeitamente alinhado.

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';

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
    </>
  );
}
```

**Reflexão:** No futuro, poderemos transformar cada link do menu em um
componente separado ou receber os ícones via `children`, o que é uma excelente
prática. Mas, por enquanto, o nosso foco é construir o layout visual da
aplicação!
