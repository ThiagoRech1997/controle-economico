# Guia Rápido de Início

## 🚀 Começando em 5 minutos

### 1. Instale as dependências

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 2. Configure o SQL Server

#### Opção A: SQL Server Local

```bash
# Execute o SQL Server (Docker)
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuaSenha123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

#### Opção B: SQL Server já instalado

Use sua instância existente e configure a conexão.

### 3. Configure as variáveis de ambiente

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env`:

```env
DATABASE_URL="sqlserver://localhost:1433;database=controle_economico;user=sa;password=SuaSenha123!;encrypt=true;trustServerCertificate=true"
PORT=3001
```

#### Frontend (.env.local)

```bash
cd frontend
cp .env.example .env.local
```

Edite `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 4. Inicialize o banco de dados

```bash
cd backend

# Gerar Prisma Client
npm run prisma:generate

# Criar banco e executar migrations
npm run prisma:migrate

# (Opcional) Visualizar banco com Prisma Studio
npm run prisma:studio
```

### 5. Inicie os servidores

#### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

Aguarde a mensagem:
```
🚀 Application is running on: http://localhost:3001
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Aguarde a mensagem:
```
✓ Ready in 2.5s
```

### 6. Acesse a aplicação

Abra o navegador em: **http://localhost:3000**

---

## 📝 Testando a API

### Criar uma transação (usando cURL ou Postman)

```bash
curl -X POST http://localhost:3001/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "account-uuid-here",
    "categoryId": "category-uuid-here",
    "type": "EXPENSE",
    "amount": 150.00,
    "description": "Compra no supermercado",
    "date": "2025-01-20",
    "isPaid": true
  }'
```

### Listar transações

```bash
curl http://localhost:3001/api/v1/transactions
```

---

## 🔧 Comandos Úteis

### Backend

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Build para produção
npm run build

# Executar testes
npm run test

# Gerar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run start

# Verificar tipos TypeScript
npm run type-check

# Formatar código
npm run format
```

---

## 🐛 Problemas Comuns

### Erro de conexão com SQL Server

**Problema**: `Error: connect ECONNREFUSED`

**Solução**:
1. Verifique se o SQL Server está rodando
2. Confirme o usuário e senha no `.env`
3. Teste a conexão: `npx prisma db push`

### Porta já em uso

**Problema**: `EADDRINUSE: address already in use :::3001`

**Solução**:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Prisma Client não gerado

**Problema**: `Cannot find module '@prisma/client'`

**Solução**:
```bash
cd backend
npm run prisma:generate
```

### Erro de CORS no frontend

**Problema**: `CORS policy: No 'Access-Control-Allow-Origin'`

**Solução**: Verifique se `CORS_ORIGINS` no backend `.env` inclui `http://localhost:3000`

---

## 📚 Próximos Passos

1. **Explorar a arquitetura**: Leia [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Criar seeders**: Popule o banco com dados de teste
3. **Implementar autenticação**: Adicione JWT auth
4. **Adicionar testes**: Escreva testes unitários e E2E
5. **Criar dashboard**: Implemente gráficos e analytics

---

## 🆘 Precisa de Ajuda?

- 📖 Leia a [documentação completa](./ARCHITECTURE.md)
- 🐛 Abra uma issue no GitHub
- 💬 Entre em contato com a equipe

---

**Pronto!** Você está pronto para desenvolver. 🎉
