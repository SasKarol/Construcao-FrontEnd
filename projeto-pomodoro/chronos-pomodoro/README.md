# 🌓 Alternando o Tema e o Problema dos Efeitos Colaterais

Nesta aula, vamos implementar a lógica para alternar o valor do nosso estado
entre `dark` e `light`.

No entanto, também vamos tentar aplicar essa mudança diretamente na tag `<html>`
do navegador e descobrir por que a abordagem mais instintiva **não funciona**
como esperado no React.

---

## 🔄 1. A Lógica de Inversão do Tema

Quando clicamos no botão de mudar o tema, queremos que o React olhe para o tema
atual e o inverta. Como o novo valor depende do valor anterior, usaremos a
função de callback dentro do nosso `setTheme`.

```tsx
setTheme(prevTheme => {
  // Se for dark, vira light. Senão, vira dark.
  const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
  return nextTheme;
});
```

### ❌ O que dá errado?

Se você clicar no botão, a interface do React muda, mas o HTML fica atrasado em
um clique! Isso acontece porque a função `setTheme` **não muda o valor em tempo
real**. O React agenda essa atualização para o próximo ciclo de renderização.
Quando a linha do `setAttribute` é executada, a variável `theme` ainda guarda o
valor velho.

## 🚨 3. A "Gambiarra" (Má Prática)

Para resolver esse "atraso", nós poderíamos pensar em mover a manipulação do DOM
para dentro da função de callback do `setTheme`, já que lá nós sabemos
exatamente qual é o `nextTheme`.

```tsx
setTheme(prevTheme => {
  const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';

  // 🔴 MÁ PRÁTICA: Alterando o DOM de dentro de uma função de estado
  // document.documentElement.setAttribute('data-theme', nextTheme);

  return nextTheme;
});
```

**Por que não devemos fazer isso?** A função que passamos para o `setTheme` deve
ser uma **Função Pura**. Isso significa que ela deve apenas calcular e retornar
um valor, sem causar interferências no mundo externo.

Manipular o DOM (`document.documentElement...`) é o que chamamos de **Efeito
Colateral**. O React não está monitorando o DOM diretamente dessa forma. Fazer
coisas que o React não espera dentro de uma função de atualização de estado pode
causar bugs difíceis de rastrear na sua aplicação.

## 💡 4. A Solução Definitiva: Preparando o Terreno

Se nós não podemos colocar efeitos colaterais soltos na função de clique (por
causa do atraso) e nem dentro do `setTheme` (porque é má prática), onde nós
colocamos?

Sempre que precisarmos lidar com coisas que fogem do monitoramento padrão do
React (manipular o DOM puro, salvar no `localStorage`, buscar dados em uma API),
nós precisamos de um Hook específico para lidar com **Efeitos Colaterais**.

Na próxima aula, vamos conhecer e aplicar o Hook `useEffect` para resolver esse
problema do jeito certo.

**Arquivo temporário (`src/components/Menu/index.tsx`):**

```tsx
import { HistoryIcon, HouseIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';
import { useState } from 'react';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const [theme, setTheme] = useState<AvailableThemes>('dark');

  function handleThemeChange(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();

    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      // ❌ document.documentElement.setAttribute('data-theme', nextTheme); (Má prática)
      return nextTheme;
    });

    // ❌ document.documentElement.setAttribute('data-theme', theme); (Fica atrasado)
  }

  return (
    // ... JSX do menu (inalterado)
  );
}
```
