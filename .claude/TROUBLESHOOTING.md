# Troubleshooting - Guia de Resolução de Problemas

Problemas comuns e suas soluções ao usar Claude Code neste projeto.

## 📋 Índice

1. [Comandos](#comandos)
2. [Hooks](#hooks)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Database](#database)
6. [Testes](#testes)
7. [MCP Servers](#mcp-servers)

---

## 🔧 Comandos

### Comandos não aparecem

**Sintoma:**
```
Você: /use-case
Claude: Comando não encontrado
```

**Causas possíveis:**
1. Arquivo comando mal formatado
2. Frontmatter YAML inválido
3. Claude Code não recarregou

**Soluções:**

✅ **1. Validar frontmatter YAML**
```markdown
---
description: "Descrição aqui"
argument-hint: "<argumentos>"
allowed-tools: ["bash", "read", "write"]
---
```

✅ **2. Reiniciar Claude Code**
- Feche e abra novamente
- Ou rode `/help` para listar comandos

✅ **3. Verificar localização**
Comandos devem estar em `.claude/commands/*.md`

---

### Comando executa mas não funciona

**Sintoma:**
```bash
/use-case payments create
# Nada acontece ou erro genérico
```

**Soluções:**

✅ **1. Verificar argumentos**
```bash
# ❌ Errado
/use-case create

# ✅ Correto
/use-case payments create-payment
#         ^^^^^^^  ^^^^^^^^^^^^^^
#         feature  nome-do-use-case
```

✅ **2. Verificar `allowed-tools`**
Se o comando usa ferramentas não permitidas, vai falhar:
```markdown
---
allowed-tools: ["bash", "read", "write", "glob", "grep"]
---
```

✅ **3. Ver logs do Claude Code**
Procure erros específicos nos logs.

---

## 🪝 Hooks

### Hooks não executam

**Sintoma:**
```
Você menciona "backend" mas hook não ativa
```

**Soluções:**

✅ **1. Validar JSON**
```bash
# Validar hooks.json
cat .claude/hooks.json | jq .
```

Se der erro, corrija a sintaxe JSON.

✅ **2. Verificar matcher (regex)**
```json
{
  "matcher": "backend|nestjs|domain"
  // Testa se pega "backend" ✅
  // Testa se pega "nest" ❌ (falta "nestjs" completo)
}
```

✅ **3. Verificar tipo de hook**
```json
{
  "type": "prompt",  // ✅ Correto
  "type": "comand"   // ❌ Typo!
}
```

---

### Hook executa múltiplas vezes

**Sintoma:**
```
Hook ativa 3x para uma única mensagem
```

**Soluções:**

✅ **1. Matcher muito genérico**
```json
// ❌ Muito genérico
{
  "matcher": ".*"  // Pega TUDO
}

// ✅ Específico
{
  "matcher": "create.*use.*case"
}
```

✅ **2. Hooks duplicados**
Verifique se não há múltiplos hooks com matchers similares.

---

## 🏗️ Backend

### Backend não inicia

**Sintoma:**
```bash
npm run start:dev
# Error: Cannot connect to database
```

**Soluções:**

✅ **1. Verificar DATABASE_URL**
```bash
# backend/.env
DATABASE_URL="sqlserver://localhost:1433;database=controle_economico;..."

# Teste a conexão
cd backend
npx prisma db execute --stdin <<< "SELECT 1"
```

✅ **2. SQL Server rodando?**
```bash
# Windows
services.msc # Procure SQL Server

# Docker
docker ps | grep sqlserver
```

✅ **3. Regenerar Prisma Client**
```bash
cd backend
npm run prisma:generate
```

---

### Erro: Cannot find module '@/...'

**Sintoma:**
```
Error: Cannot find module '@/domain/entities/transaction'
```

**Soluções:**

✅ **1. Verificar tsconfig.json**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // ✅ Deve estar assim
    }
  }
}
```

✅ **2. Reinstalar dependências**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Erros de tipo Prisma Decimal

**Sintoma:**
```typescript
Type 'Decimal' is not assignable to type 'number'
```

**Solução:**

✅ **Usar .toNumber()**
```typescript
// ❌ Errado
const amount: number = prismaTransaction.amount;

// ✅ Correto
const amount: number = prismaTransaction.amount.toNumber();

// Ou no mapper
toDomain(prisma): Transaction {
  return new Transaction(
    prisma.id,
    prisma.amount.toNumber(),  // 👈 Converte Decimal → number
    // ...
  );
}
```

---

## 🎨 Frontend

### Frontend não conecta ao backend

**Sintoma:**
```
Network Error: Failed to fetch
```

**Soluções:**

✅ **1. Verificar NEXT_PUBLIC_API_URL**
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# ❌ Errado
NEXT_PUBLIC_API_URL=http://localhost:3001  # Falta /api/v1

# ❌ Errado
API_URL=http://localhost:3001/api/v1  # Falta NEXT_PUBLIC_
```

✅ **2. Backend está rodando?**
```bash
curl http://localhost:3001/api/v1/health
# Deve retornar 200 OK
```

✅ **3. CORS configurado?**
```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',  // 👈 Frontend URL
  credentials: true,
});
```

---

### React Query não atualiza

**Sintoma:**
```typescript
Dados alterados no backend mas UI não atualiza
```

**Solução:**

✅ **Invalidar queries**
```typescript
// ❌ Sem invalidation
const mutation = useMutation({
  mutationFn: (data) => service.create(data),
});

// ✅ Com invalidation
const mutation = useMutation({
  mutationFn: (data) => service.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  },
});
```

---

### Erro: Hydration failed

**Sintoma:**
```
Error: Hydration failed because the initial UI does not match
```

**Soluções:**

✅ **1. Usar 'use client' quando necessário**
```typescript
// ❌ Componente com hooks sem 'use client'
export function MyComponent() {
  const [state, setState] = useState();
  // ...
}

// ✅ Com 'use client'
'use client';

export function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

✅ **2. Evitar Date/Math.random no SSR**
```typescript
// ❌ Causa hydration mismatch
<div>{new Date().toISOString()}</div>

// ✅ Use useEffect
const [date, setDate] = useState('');
useEffect(() => {
  setDate(new Date().toISOString());
}, []);
```

---

## 🗄️ Database

### Migration falha

**Sintoma:**
```bash
npx prisma migrate dev
# Error: Column already exists
```

**Soluções:**

✅ **1. Resetar DB (DEV ONLY)**
```bash
cd backend
npx prisma migrate reset
npm run prisma:migrate
```

✅ **2. Ou corrigir migration manualmente**
```bash
# Editar a migration SQL
backend/prisma/migrations/<timestamp>_xxx/migration.sql

# Reaplicar
npx prisma migrate resolve --applied <nome-da-migration>
```

---

### Prisma Studio não abre

**Sintoma:**
```bash
npm run prisma:studio
# Timeout ou erro de conexão
```

**Soluções:**

✅ **1. Porta 5555 ocupada**
```bash
# Windows
netstat -ano | findstr :5555
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5555 | xargs kill -9
```

✅ **2. DATABASE_URL incorreta**
Verifique `.env` e teste conexão.

---

## 🧪 Testes

### Testes falhando após refatoração

**Sintoma:**
```
FAIL  create-transaction.use-case.spec.ts
TypeError: Cannot read property 'create' of undefined
```

**Soluções:**

✅ **1. Atualizar mocks**
```typescript
// ❌ Mock antigo (antes da refatoração)
transactionRepo.save.mockResolvedValue(/* ... */);

// ✅ Mock atualizado (depois da refatoração)
transactionRepo.create.mockResolvedValue(/* ... */);
//              ^^^^^^ Nome mudou
```

✅ **2. Usar factory para testes**
```typescript
// test/factories/transaction.factory.ts
export const TransactionFactory = {
  create: (overrides = {}) => ({
    id: uuid(),
    amount: 100,
    type: 'INCOME',
    ...overrides,
  }),
};

// No teste
const transaction = TransactionFactory.create({ amount: 500 });
```

---

### Coverage baixo

**Sintoma:**
```
Statements: 45% (threshold: 80%)
```

**Soluções:**

✅ **1. Identificar arquivos não testados**
```bash
npm run test:coverage
# Veja coverage/lcov-report/index.html
```

✅ **2. Focar em use cases primeiro**
Use cases devem ter 100% coverage.

✅ **3. Ignorar arquivos gerados**
```json
// jest.config.js
{
  "coveragePathIgnorePatterns": [
    "node_modules",
    ".module.ts$",
    "main.ts",
    ".interface.ts$"
  ]
}
```

---

## 🔌 MCP Servers

### MCP GitHub não conecta

**Sintoma:**
```
MCP server 'github' failed to start
```

**Soluções:**

✅ **1. Verificar token**
```json
// .mcp.json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"  // ✅ Começa com ghp_
      }
    }
  }
}
```

Obtenha token em: https://github.com/settings/tokens

Permissões necessárias:
- `repo`
- `read:org`

✅ **2. Instalar MCP server**
```bash
npm install -g @modelcontextprotocol/server-github
```

✅ **3. Verificar path (Windows)**
```json
{
  "mcpServers": {
    "filesystem": {
      "env": {
        // ❌ Errado
        "ALLOWED_DIRECTORIES": "C:\Users\srbil\dev"

        // ✅ Correto (escaping)
        "ALLOWED_DIRECTORIES": "C:\\Users\\srbil\\dev"
      }
    }
  }
}
```

---

### MCP commands não aparecem

**Sintoma:**
```bash
/mcp__github__list-repositories
# Command not found
```

**Soluções:**

✅ **1. Verificar se MCP está habilitado**
```bash
# No Claude Code
/mcp

# Deve listar servers ativos
```

✅ **2. Reiniciar Claude Code**
Após editar `.mcp.json`, sempre reinicie.

✅ **3. Ver logs**
```bash
# Procure erros nos logs do Claude Code
```

---

## 🆘 Ajuda Adicional

### Ainda com problemas?

1. **Verifique logs:** Sempre olhe os logs completos
2. **Google o erro:** Copie a mensagem exata
3. **EXAMPLES.md:** Veja exemplos práticos
4. **Pergunte ao Claude:**
   ```
   Debug este erro: [cole o erro aqui]
   ```

### Reportar Bug

Se encontrou um bug na configuração do Claude Code:

1. Vá para: [GitHub Issues](https://github.com/anthropics/claude-code/issues)
2. Descreva:
   - O que você tentou fazer
   - O que esperava
   - O que aconteceu
   - Logs/screenshots

---

## 📚 Links Úteis

- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Comandos rápidos
- [EXAMPLES.md](EXAMPLES.md) - Exemplos práticos
- [USAGE-GUIDE.md](USAGE-GUIDE.md) - Guia completo
- [Claude Code Docs](https://code.claude.com/docs)

---

**Lembre-se:** A maioria dos problemas são erros de configuração simples. Siga o checklist acima! ✅
