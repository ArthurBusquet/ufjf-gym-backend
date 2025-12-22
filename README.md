# 🏋️ UFJF GYM - Backend

API REST do sistema de gerenciamento de academia, desenvolvido com **Node.js**, **TypeScript**, **Prisma ORM** e **Docker**.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) versão 18+ (recomendado: 20.18.0)
- [Yarn](https://yarnpkg.com/) ou npm

### Passo a Passo

```bash
# 1. Clone o repositório (se ainda não fez)
git clone <url-do-repositorio>
cd ufjf-gym-backend

# 2. Crie o arquivo .env na raiz do projeto
# (veja a seção "Variáveis de Ambiente" abaixo)

# 3. Suba o container do banco de dados PostgreSQL
docker compose up -d

# 4. Instale as dependências
yarn install
# ou
npm install

# 5. Execute as migrações do Prisma para criar as tabelas
npx prisma migrate dev --name init

# 6. Popule o banco de dados com dados iniciais
npx prisma db seed

# 7. Inicie o servidor de desenvolvimento
yarn dev
# ou
npm run dev
```

O servidor estará rodando em [http://localhost:3333](http://localhost:3333).

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Conexão com o banco de dados PostgreSQL
DATABASE_URL="postgresql://root:root@localhost:5432/mydb"

# Configurações do JWT
JWT_SECRET=ufjf-gym
JWT_EXPIRATION=5d
```

---

## 🔐 Credenciais de Teste

Após executar o seed, use as seguintes credenciais para login:

| Role          | Email                  | Senha  |
| ------------- | ---------------------- | ------ |
| Administrador | admin@academia.com     | 123456 |
| Recepcionista | ana.recep@academia.com | 123456 |
| Professor     | joao.prof@academia.com | 123456 |
| Aluno         | lucas.aluno@email.com  | 654321 |

---

## 🛠️ Scripts Disponíveis

| Comando                  | Descrição                                  |
| ------------------------ | ------------------------------------------ |
| `yarn dev`               | Inicia o servidor em modo desenvolvimento  |
| `yarn build`             | Compila o TypeScript para JavaScript       |
| `yarn start`             | Inicia o servidor em modo produção         |
| `yarn test`              | Executa os testes unitários                |
| `yarn test:watch`        | Executa testes em modo watch               |
| `yarn test:coverage`     | Executa testes com relatório de cobertura  |
| `npx prisma studio`      | Abre o Prisma Studio para visualizar dados |
| `npx prisma migrate dev` | Executa migrações pendentes                |
| `npx prisma db seed`     | Popula o banco com dados iniciais          |
| `npx prisma generate`    | Regenera o cliente Prisma                  |

---

## 🧪 Testes Unitários

O projeto utiliza **Jest** com **ts-jest** para testes unitários em TypeScript.

### Executar Testes

```bash
# Instalar dependências de teste (primeira vez)
yarn install

# Executar todos os testes
yarn test

# Executar testes com cobertura
yarn test:coverage

# Executar testes em modo watch
yarn test:watch
```

### Testes Disponíveis

| Arquivo                 | Descrição                                |
| ----------------------- | ---------------------------------------- |
| `HashProvider.test.ts`  | Testes do provider de hash (bcrypt)      |
| `loginSchema.test.ts`   | Testes de validação do schema de login   |
| `userSchema.test.ts`    | Testes de validação do schema de usuário |
| `AppError.test.ts`      | Testes da classe de erro customizada     |
| `DayJsProvider.test.ts` | Testes do provider de datas              |

### Estrutura dos Testes

```
src/
└── __tests__/
    ├── HashProvider.test.ts
    ├── loginSchema.test.ts
    ├── userSchema.test.ts
    ├── AppError.test.ts
    └── DayJsProvider.test.ts
```

---

## 📁 Estrutura do Projeto

```
src/
├── controllers/         # Controllers da aplicação
│   ├── AuthController.ts
│   ├── UserController.ts
│   ├── WorkoutPlanController.ts
│   └── ...
├── middlewares/         # Middlewares
│   ├── authMiddleware.ts
│   └── validateMiddleware.ts
├── providers/           # Providers (Hash, etc.)
│   └── HashProvider.ts
├── repositories/        # Repositórios (Padrão Repository)
│   ├── IUsersRepository.ts
│   └── PrismaUsersRepository.ts
├── routes/              # Definição das rotas
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   └── index.ts
├── services/            # Serviços de negócio
│   └── MembershipService.ts
├── app.ts               # Configuração do Express
└── server.ts            # Ponto de entrada
prisma/
├── schema.prisma        # Schema do banco de dados
├── seed.ts              # Script de seed
└── migrations/          # Migrações do banco
```

---

## 🔌 Endpoints da API

### Autenticação

| Método | Rota                  | Descrição        | Auth |
| ------ | --------------------- | ---------------- | ---- |
| POST   | `/api/sessions/login` | Login do usuário | ❌   |
| GET    | `/api/health`         | Health check     | ❌   |

### Usuários

| Método | Rota                 | Descrição                    | Auth |
| ------ | -------------------- | ---------------------------- | ---- |
| GET    | `/api/users`         | Listar todos os funcionários | ✅   |
| GET    | `/api/users/profile` | Perfil do usuário logado     | ✅   |
| POST   | `/api/users/create`  | Criar novo usuário           | ✅   |
| PUT    | `/api/users/:id`     | Atualizar usuário            | ✅   |
| DELETE | `/api/users/:id`     | Deletar usuário              | ✅   |

### Alunos

| Método | Rota                    | Descrição                 | Auth |
| ------ | ----------------------- | ------------------------- | ---- |
| GET    | `/api/students`         | Listar alunos (admin)     | ✅   |
| GET    | `/api/students/list`    | Listar alunos (professor) | ✅   |
| GET    | `/api/students/profile` | Perfil do aluno logado    | ✅   |

### Fichas de Treino

| Método | Rota                    | Descrição                | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| GET    | `/api/workout-plan/:id` | Obter ficha do aluno     | ✅   |
| PUT    | `/api/workout-plan/:id` | Atualizar ficha do aluno | ✅   |

---

## 🧰 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [JWT](https://jwt.io/) para autenticação
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) para hash de senhas

---

## ⚠️ Solução de Problemas

### Erro: "Can't reach database server at localhost:5432"

1. Verifique se o Docker está rodando:

   ```bash
   docker ps
   ```

2. Se o container não estiver rodando, inicie-o:

   ```bash
   docker compose up -d
   ```

3. Verifique se não há outro PostgreSQL local ocupando a porta 5432:

   ```bash
   # Windows
   netstat -ano | findstr :5432

   # Linux/Mac
   lsof -i :5432
   ```

### Erro: "Unique constraint failed"

Execute novamente o seed para limpar e recriar os dados:

```bash
npx prisma migrate reset
```

### Prisma Client desatualizado

Regenere o cliente após alterações no schema:

```bash
npx prisma generate
```

### Verificar dados no banco

Use o Prisma Studio para visualizar os dados:

```bash
npx prisma studio
```

---

## 🔄 Fluxo de Desenvolvimento

1. **Alterar schema**: Edite `prisma/schema.prisma`
2. **Criar migração**: `npx prisma migrate dev --name nome_da_migracao`
3. **Atualizar client**: `npx prisma generate`
4. **Reiniciar servidor**: O servidor deve reiniciar automaticamente com `yarn dev`

---

## 📦 Docker Compose

O arquivo `docker-compose.yml` configura:

- **PostgreSQL** na porta 5432
- **Volume persistente** para dados do banco

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
```
