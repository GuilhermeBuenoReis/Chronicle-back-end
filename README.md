# 🚀 **In.orbit**

**Versão 1.0.0**

O projeto **NLW Pocket** é uma API de alta performance desenvolvida com **Fastify**, **TypeScript** e **Drizzle ORM**, focada em segurança, escalabilidade e boas práticas.

---

## 📋 **Scripts Disponíveis**

| Comando               | Descrição                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`         | Inicia o servidor em modo de desenvolvimento.                                                  |
| `npm run seed`        | Popula o banco de dados com dados iniciais (seed).                                             |
| `npm run test`        | Executa os testes unitários com **Vitest**.                                                    |
| `npm run test:watch`  | Roda os testes em modo "watch" para desenvolvimento contínuo.                                  |
| `npm run db:migrate:test` | Realiza as migrações no banco de dados de teste.                                          |

---

## 🛠️ **Tecnologias Utilizadas**

### 🔧 **Dependências Principais**
- **[Fastify](https://fastify.dev/)**: Framework web rápido e otimizado.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM simples e eficiente para TypeScript.
- **Postgres**: Banco de dados SQL robusto e escalável.
- **[Zod](https://zod.dev/)**: Validação de schemas e dados.
- **Day.js**: Manipulação e formatação de datas.
- **JWT (JSON Web Token)**: Autenticação segura com **@fastify/jwt** e **jose**.
- **CUID2**: Geração de identificadores únicos.
- **Swagger UI**: Documentação automática da API com **@fastify/swagger**.

---

## 📦 **Ferramentas de Desenvolvimento**

- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Vitest**: Framework de testes unitários rápido e simples.
- **Drizzle Kit**: Ferramenta de CLI para migrações e gerenciamento do banco de dados.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **TSX**: Execução de TypeScript em tempo real.

---

## 🔐 **Configuração das Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```plaintext
NODE_ENV=development
DATABASE_URL= # URL do banco de dados PostgreSQL
GITHUB_CLIENT_ID= # ID do cliente GitHub
GITHUB_CLIENT_SECRET= # Segredo do cliente GitHub
JWT_SECRET= # Chave secreta para JWT
```

### **Exemplo de `.env`**

```plaintext
NODE_ENV=development
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome-do-banco"
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
JWT_SECRET=uma_chave_muito_segura
```

## 🚀 **Como Rodar o Projeto**

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/GuilhermeBuenoReis/In-Orbit.git
   cd In-orbit
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie o arquivo `.env` conforme o exemplo acima.

4. **Execute as migrações do banco de dados**:
   ```bash
   npm run db:migrate:test
   ```

5. **Rode o servidor em desenvolvimento**:
   ```bash
   npm run dev
   ```

6. **Teste a aplicação** (opcional):
   ```bash
   npm run test
   ```

---

## 📄 **Documentação da API**

A documentação Swagger será gerada automaticamente e estará disponível no seguinte endpoint:

```
http://localhost:3333/docs
```

---

## 🧪 **Testes**

Os testes são escritos utilizando **Vitest**. Para executá-los, utilize:

```bash
npm run test
```

Para modo de desenvolvimento contínuo:

```bash
npm run test:watch
```

---

## 📧 **Contato**

Caso tenha dúvidas ou sugestões, entre em contato pelo e-mail:  
**[guilhermebuenoreis@gmail.com**

---

**Feito por [Guilherme Bueno]**  

--- 
