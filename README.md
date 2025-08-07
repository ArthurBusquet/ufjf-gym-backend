# UFJF GYM

Este projeto é o backend da aplicação UFJF construída com **Node.js**, **TypeScript**, **Prisma ORM** e **Docker**.

---

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/) (ou outro banco compatível)
- [dotenv](https://github.com/motdotla/dotenv) para variáveis de ambiente

---

## Exemplo de dados para login

Email: admin@academia.com
senha: 12456

## Como rodar o projeto

### Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) e [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- Versão sugerida para o Node: 20.18.0

---

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

DATABASE_URL="postgresql://root:root@localhost:5432/mydb"

JWT_SECRET=ufjf-gym
JWT_EXPIRATION=5d

### Comandos para rodar o projeto

1. suba o container docker para o banco de dados

```bash
docker compose up -d
```

2. instale as dependencias

```bash
yarn install
```

3. Execute as migrações do Prisma para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev --name init
```

4. Popule o banco de dados com dados iniciais:

```bash
npx prisma db seed
```

5. Certifique-se de que o backend está rodando na porta 3333

6. Inicie o servidor de desenvolvimento:

```bash
yarn dev
```

7. (Opcional) Caso queira ver os dados do banco de maneira mais clara, abra o prima studio

```bash
npx prisma studio
```
