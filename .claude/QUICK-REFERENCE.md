# Quick Reference - Comandos Rápidos

Referência rápida para os comandos e recursos mais usados do Claude Code neste projeto.

## 🎯 Comandos Principais

```bash
# Criar use case backend
/use-case <feature> <nome>

# Criar módulo frontend
/feature <nome>

# Validar arquitetura
/arch-validate

# Validações pré-commit
/pre-commit

# Helper migrations
/db-migrate <nome>
```

---

## 📋 Checklists

### ✅ Antes de Commitar
- [ ] `/pre-commit` passou
- [ ] `/arch-validate` sem violações
- [ ] Testes novos adicionados
- [ ] Documentação atualizada

### ✅ Antes de PR
- [ ] `/pre-commit` OK
- [ ] `/arch-validate` OK
- [ ] Coverage > 80%
- [ ] Changelog atualizado
- [ ] Screenshots (se UI)

### ✅ Nova Feature
- [ ] Use case backend criado
- [ ] Módulo frontend criado
- [ ] Testes unitários (>80%)
- [ ] Testes integração
- [ ] Documentação API
- [ ] README atualizado

---

## 🏗️ Estrutura Backend (Clean Architecture)

```
backend/src/
├── domain/               # Lógica pura
│   ├── entities/        # Entidades de negócio
│   └── repositories/    # Interfaces (portas)
├── application/         # Casos de uso
│   ├── dtos/           # Input/Output
│   └── use-cases/      # Lógica de aplicação
└── infrastructure/      # Adaptadores
    ├── persistence/     # Prisma repos
    ├── http/           # Controllers
    └── modules/        # NestJS DI
```

**Regra de ouro:** `domain` ← `application` ← `infrastructure`

---

## 🎨 Estrutura Frontend (Feature-Sliced)

```
frontend/src/
├── app/                 # Routing only
├── modules/            # Features
│   └── <feature>/
│       ├── components/  # UI
│       ├── hooks/      # React Query
│       ├── services/   # API
│       └── types/      # TypeScript
└── shared/             # Compartilhado
```

**Regra de ouro:** Sem cross-module imports!

---

## 🔍 Busca Rápida

### Encontrar Código

```bash
# Encontrar use case
fd -e ts use-case backend/

# Encontrar componente
fd -e tsx <ComponentName> frontend/

# Encontrar por conteúdo
rg "TransactionRepository" backend/
```

### Templates Rápidos

Ver [patterns.md](.claude/patterns.md) para:
- Domain Entity
- Repository Interface
- Use Case
- DTO
- Controller
- React Component
- React Query Hooks

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test                          # Todos
npm test -- <file>               # Específico
npm test -- --coverage           # Com coverage
npm test -- --watch              # Watch mode

# Frontend
cd frontend
npm test                         # Todos
npm test -- <Component>          # Específico
npm run test:coverage            # Coverage
```

---

## 🗄️ Database (Prisma)

```bash
cd backend

# Studio visual
npm run prisma:studio

# Gerar client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Reset DB (DEV ONLY!)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

**Ou use:** `/db-migrate <nome>`

---

## 🔧 Development

```bash
# Backend (porta 3001)
cd backend && npm run start:dev

# Frontend (porta 3000)
cd frontend && npm run dev

# Ambos em paralelo (root)
npm run dev
```

---

## 📊 Code Quality

```bash
# Lint
cd backend && npm run lint
cd frontend && npm run lint

# Format
cd backend && npm run format
cd frontend && npm run format

# Type check
cd backend && npm run type-check
cd frontend && npm run type-check
```

**Ou use:** `/pre-commit`

---

## 🎯 Atalhos do Claude

### Criar Estrutura Completa

```
Crie uma feature de relatórios mensais:
1. /use-case reports generate-monthly-report
2. /feature reports
3. /arch-validate
4. /pre-commit
```

### Code Review

```
/review

# Ou
Faça code review das minhas mudanças
```

### Troubleshooting

```
Por que os testes estão falhando?

# Ou
Debug o erro: [cole o erro aqui]
```

---

## 🗂️ Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `CLAUDE.md` | Guia do projeto |
| `.claude/patterns.md` | Templates |
| `.claude/hooks.json` | Hooks |
| `.claude/settings.local.json` | Config |
| `backend/prisma/schema.prisma` | Schema DB |
| `backend/.env` | Env vars |

---

## 🔐 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=sqlserver://...
PORT=3001
API_PREFIX=/api/v1
NODE_ENV=development
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 🐛 Debug Rápido

### Backend não inicia
1. Verifique DATABASE_URL
2. Rode `npm run prisma:generate`
3. Verifique porta 3001 livre

### Frontend erro de API
1. Verifique NEXT_PUBLIC_API_URL
2. Backend está rodando?
3. CORS configurado?

### Testes falhando
1. Rode `/pre-commit` para ver erros
2. Verifique mocks atualizados
3. Limpe cache: `npm run test -- --clearCache`

---

## 📚 Documentação Completa

- [README.md](.claude/README.md) - Overview
- [USAGE-GUIDE.md](.claude/USAGE-GUIDE.md) - Guia completo
- [EXAMPLES.md](.claude/EXAMPLES.md) - Exemplos práticos
- [TROUBLESHOOTING.md](.claude/TROUBLESHOOTING.md) - Problemas
- [INDEX.md](.claude/INDEX.md) - Índice completo

---

## 💡 Dicas Pro

1. **Use hooks:** Deixe o Claude sugerir automaticamente
2. **Valide sempre:** `/arch-validate` + `/pre-commit`
3. **Templates:** Copie de `patterns.md`
4. **Exemplos:** Veja `EXAMPLES.md`
5. **Trouble:** Consulte `TROUBLESHOOTING.md`

---

**Marque esta página!** É sua referência diária. 🚀
