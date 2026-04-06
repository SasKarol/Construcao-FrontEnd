# 📝 Componente `GenericHtml`: Estilizando Páginas de Texto

Até agora, focamos muito em componentes interativos. Mas e quando precisamos de
páginas focadas em texto, como um "Sobre nós" ou uma "Página 404"? Ficar
adicionando classes CSS em cada tag `<p>`, `<h2>` ou `<ul>` seria exaustivo.

Nesta aula, vamos criar o componente `GenericHtml`. A ideia dele é simples: ele
abraça qualquer conteúdo HTML puro e aplica uma estilização global a ele através
do CSS Modules. Assim, ganhamos flexibilidade e reaproveitamento de código!

---

## 🏗️ 1. Criando o Componente `GenericHtml`

Vamos criar uma pasta para o nosso componente e definir que ele receberá
`children` (o conteúdo HTML que colocaremos dentro dele).

**Arquivo:** `src/components/GenericHtml/index.tsx`

```tsx
import styles from './styles.module.css';

type GenericHtmlProps = {
  children: React.ReactNode;
};

export function GenericHtml({ children }: GenericHtmlProps) {
  return <div className={styles.genericHtml}>{children}</div>;
}
```

## O CSS Modular

Aqui é onde a mágica acontece. Estilizamos as tags diretamente, mas **apenas**
quando elas estiverem dentro da classe `.genericHtml`.

**Arquivo:** `src/components/GenericHtml/styles.module.css`

```css
.genericHtml h1 {
  font-size: 3.2rem;
  margin-bottom: 1.6rem;
}

.genericHtml h2 {
  font-size: 2.4rem;
  margin-bottom: 1.2rem;
}

.genericHtml h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.genericHtml p {
  font-size: 1.6rem;
  line-height: 1.6;
  margin-bottom: 1.6rem;
}

.genericHtml a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
}

.genericHtml a:hover {
  text-decoration: underline;
}

.genericHtml ul {
  padding-left: 2.4rem;
}

.genericHtml li {
  margin-bottom: 0.8rem;
}

.genericHtml img {
  max-width: 100%;
  height: auto;
  border-radius: 0.8rem;
  display: block;
  margin: 1.6rem 0;
}
```

## 🚀 2. Aplicando nas Páginas

Agora que temos o nosso "estilizador automático" de textos, vamos aplicá-lo em
duas páginas: a nossa página de Erro 404 e uma nova página que explica a Técnica
Pomodoro.

💡 **Dica:** Como o conteúdo dessas páginas é puramente texto (HTML), você pode
simplesmente copiar os códigos abaixo para economizar tempo de digitação.

**Página 404 Atualizada** **Arquivo:** `src/pages/NotFound/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

export function NotFound() {
  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>404 - Página não encontrada 🚀</Heading>
          <p>
            Opa! Parece que a página que você está tentando acessar não existe.
            Talvez ela tenha tirado férias, resolvido explorar o universo ou se
            perdido em algum lugar entre dois buracos negros. 🌌
          </p>
          <p>
            Mas calma, você não está perdido no espaço (ainda). Dá pra voltar em
            segurança para a <a href='/'>página principal</a> ou{' '}
            <a href='/history'>para o histórico</a> — ou pode ficar por aqui e
            fingir que achou uma página secreta que só os exploradores mais
            legais conseguem acessar. 🧭✨
          </p>
          <p>
            Se você acha que essa página deveria existir (ou se quiser bater um
            papo sobre viagem no tempo e buracos de minhoca), é só entrar em
            contato. Caso contrário, use o menu para voltar ao mundo real.
          </p>
          <p>
            Enquanto isso, fica aqui uma reflexão: "Se uma página não existe na
            internet, será que ela existiu de verdade?" 🤔💭
          </p>
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}
```

**Nova Página: Sobre o Pomodoro** Crie a pasta `AboutPomodoro` dentro de `pages`
e cole o conteúdo:

**Arquivo:** `src/pages/AboutPomodoro/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

export function AboutPomodoro() {
  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>A Técnica Pomodoro 🍅</Heading>

          <p>
            A Técnica Pomodoro é uma metodologia de produtividade criada por{' '}
            <strong>Francesco Cirillo</strong>, que consiste em dividir o
            trabalho em blocos de tempo intercalados com pausas.
          </p>

          <img
            src='[https://placehold.co/1920x1080](https://placehold.co/1920x1080)'
            alt='Exemplo'
          />

          <h2>Como funciona o Pomodoro tradicional?</h2>
          <ul>
            <li>
              <strong>1. Defina uma tarefa</strong> que você deseja realizar.
            </li>
            <li>
              <strong>2. Trabalhe nela por 25 minutos</strong> sem interrupções.
            </li>
            <li>
              <strong>3. Faça uma pausa curta de 5 minutos</strong>.
            </li>
            <li>
              <strong>4. A cada 4 ciclos, faça uma pausa longa</strong> (15 a 30
              minutos).
            </li>
          </ul>

          <h2>
            Mas no <strong>Chronos Pomodoro</strong> tem um diferencial 🚀
          </h2>
          <p>
            Nosso app segue o conceito original, mas com algumas melhorias e
            personalizações pra deixar o processo ainda mais eficiente.
          </p>

          {/* Pode adicionar o resto do texto explicativo aqui! */}
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}
```

## 🛠️ 3. Testando as Páginas

Para ver se tudo ficou bonito, vá até o seu `App.tsx` e troque temporariamente o
componente `<Home />` por `<NotFound />` ou `<AboutPomodoro />`. Você vai
perceber que os títulos, parágrafos e listas já assumiram um espaçamento e
tamanho de fonte muito agradáveis, com suporte nativo ao nosso tema
claro/escuro!

Volte o `App.tsx` para `<Home />` quando terminar de testar.
