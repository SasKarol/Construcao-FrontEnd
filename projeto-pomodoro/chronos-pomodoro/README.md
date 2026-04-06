# 🏗️ Refatoração: Arquitetura de Templates e Páginas

Nossa aplicação está crescendo! Se olharmos para o nosso design, perceberemos
que a `Logo`, o `Menu` e o `Footer` estarão presentes em todas as telas (Home,
Histórico, Configurações). A única coisa que muda é o "miolo" (o conteúdo
central).

Nesta aula, vamos organizar nossa arquitetura separando responsabilidades. Vamos
criar o conceito de **Templates** (para o layout fixo) e **Pages** (para as
telas específicas).

---

## 🧩 1. Extraindo o Formulário (`MainForm`)

Primeiro, vamos tirar aquele formulário gigante do meio do arquivo e
transformá-lo em um componente próprio.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';

export function MainForm() {
  return (
    <form className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
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
  );
}
```

## 🖼️ 2. Criando o Template Principal (MainTemplate)

Um Template é um componente que define o esqueleto da página. Ele recebe as
partes fixas (cabeçalho, rodapé) e usa a propriedade `children` do React para
renderizar o conteúdo dinâmico no meio.

**💡 Dica de Ouro do VS Code:** Ao criar um novo arquivo, você pode digitar o
caminho completo (ex: `templates/MainTemplate/index.tsx`) e o VS Code criará as
pastas automaticamente! Se a visualização das pastas ficar espremida em uma
linha só, vá nas configurações do VS Code e desmarque a opção **Explorer:**
**Compact Folders** (`explorer.compactFolders: false`).

**Arquivo:** `src/templates/MainTemplate/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { Menu } from '../../components/Menu';

type MainTemplateProps = {
  children: React.ReactNode; // Tipagem para aceitar elementos React dentro da tag
};

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <>
      <Container>
        <Logo />
      </Container>

      <Container>
        <Menu />
      </Container>

      {/* Aqui é onde o conteúdo específico de cada página será injetado */}
      {children}

      <Container>
        <Footer />
      </Container>
    </>
  );
}
```

## 📄 3. Criando as Páginas (Pages)

Agora, criamos uma pasta `pages` para representar nossas telas. Cada tela vai
"vestir" o nosso `MainTemplate`.

**A Página Principal (Home)** **Arquivo:** `src/pages/Home/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';

export function Home() {
  return (
    <MainTemplate>
      {/* Tudo o que está aqui dentro é o "children" que o template vai renderizar */}
      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
```

**A Página de Erro (Not Found)** Já vamos deixar preparada uma página de erro
para quando implementarmos as rotas e o usuário digitar um endereço que não
existe.

**Arquivo:** `src/pages/NotFound/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { MainTemplate } from '../../templates/MainTemplate';

export function NotFound() {
  return (
    <MainTemplate>
      <Container>
        <h1>Página não encontrada</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, at
          et reiciendis eos ipsum earum?
        </p>
      </Container>
    </MainTemplate>
  );
}
```

## 🧹 4. Limpando o `App.tsx`

Lembra como o nosso `App.tsx` estava gigante? Agora, a única responsabilidade
dele é importar a página inicial. Mais para frente, é aqui que configuraremos o
nosso roteador (React Router).

**Arquivo:** `src/App.tsx`

```tsx
import { Home } from './pages/Home';

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return <Home />;
}
```
