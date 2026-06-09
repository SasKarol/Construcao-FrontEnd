# Entrega - autenticacao Pomodoro

## Como subir a API

```bash
cd praticas/projeto-pomodoro/pomodoro-api-updated
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Variaveis no `.env` da API:

```env
DATABASE_URL="mysql://root:iesb@localhost:3306/pomodoro_db"
PORT=3333
FRONTEND_URL="http://localhost:5173"
```

## Como subir o app

```bash
cd praticas/projeto-pomodoro/pomodoro
npm install
npm run dev
```

Variavel opcional no frontend:

```env
VITE_API_URL="http://localhost:3333"
```

## Como testar

1. Acesse `http://localhost:5173`.
2. Clique em `Criar uma conta`, informe nome, e-mail e senha com pelo menos 6 caracteres.
3. O app entra automaticamente e mostra `Bem-vindo` com o nome do usuario.
4. Crie tarefas e altere configuracoes. Esses dados ficam vinculados ao usuario autenticado.
5. Clique no icone de sair no menu. O app volta para o login e exige nova autenticacao.
6. Tente abrir direto `/history/` ou `/settings/` sem sessao. A tela de login sera exibida.
7. Em `Esqueci minha senha`, informe o e-mail cadastrado. Em laboratorio, a API retorna o token na tela.
8. Use o token em `Redefinir senha`, informe a nova senha e depois faca login com ela.

Observacao: nao ha envio real de e-mail. Para reproduzir em sala, o endpoint `/auth/forgot-password` retorna `resetToken` quando o e-mail existe. O token expira em 30 minutos e so pode ser usado uma vez.

Usuario legado criado pela migration, caso existam dados antigos:

```text
E-mail: legacy@example.com
Senha: legacy123
```
