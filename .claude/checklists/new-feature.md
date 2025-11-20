# Checklist: Nova Feature

Use esta checklist ao implementar uma nova feature do início ao fim.

## 📋 Planning

### Requisitos

- [ ] Feature bem definida e escopo claro
- [ ] Casos de uso identificados
- [ ] Fluxo de dados mapeado
- [ ] UI/UX mockups (se aplicável)
- [ ] Aprovação do PO/cliente

### Design

- [ ] Entidades de domínio identificadas
- [ ] Repositories necessários listados
- [ ] Use cases planejados
- [ ] API endpoints definidos
- [ ] Database schema planejado

---

## 🏗️ Backend Implementation

### 1. Domain Layer

- [ ] **Entities** criadas em `domain/entities/`
  ```bash
  /use-case <feature> create-<entity>
  ```
- [ ] **Value Objects** (se necessário)
- [ ] **Repository Interfaces** em `domain/repositories/`
- [ ] Lógica de negócio nas entities
- [ ] Testes unitários das entities

**Template:** Ver [patterns.md - Domain Entity](../patterns.md)

### 2. Application Layer

- [ ] **DTOs** em `application/dtos/<feature>/`
  - [ ] Input DTOs com validações
  - [ ] Output DTOs (response)
- [ ] **Use Cases** em `application/use-cases/<feature>/`
  - [ ] Create
  - [ ] Read (list, getById)
  - [ ] Update
  - [ ] Delete
  - [ ] Custom use cases
- [ ] Testes unitários dos use cases (100% coverage)

**Template:** Ver [patterns.md - Use Case](../patterns.md)

### 3. Infrastructure Layer

- [ ] **Prisma Schema** atualizado
  ```bash
  /db-migrate add-<feature>-table
  ```
- [ ] **Repository Implementation** em `infrastructure/persistence/prisma/`
- [ ] **Mappers** (Prisma ↔ Domain)
- [ ] **Controllers** em `infrastructure/http/controllers/`
- [ ] **Module** configurado em `infrastructure/modules/`
- [ ] Testes de integração (opcional, mas recomendado)

**Template:** Ver [patterns.md - Prisma Repository](../patterns.md)

---

## 🎨 Frontend Implementation

### 1. Feature Module

```bash
/feature <feature-name>
```

- [ ] **Types** em `modules/<feature>/types/`
- [ ] **Service** em `modules/<feature>/services/`
  - [ ] CRUD methods
  - [ ] Error handling
- [ ] **React Query Hooks** em `modules/<feature>/hooks/`
  - [ ] useItems (list)
  - [ ] useItem (getById)
  - [ ] useCreateItem
  - [ ] useUpdateItem
  - [ ] useDeleteItem
- [ ] **Components** em `modules/<feature>/components/`
  - [ ] List component
  - [ ] Item component
  - [ ] Form component (create/edit)
  - [ ] Delete confirmation
- [ ] **Index** (barrel export)

**Template:** Ver [patterns.md - React Query Hooks](../patterns.md)

### 2. App Router Integration

- [ ] Page criada em `app/<feature>/page.tsx`
- [ ] Layout (se necessário)
- [ ] Loading state (`loading.tsx`)
- [ ] Error boundary (`error.tsx`)
- [ ] Not found (`not-found.tsx` se aplicável)

### 3. Shared Components (se necessário)

- [ ] Adicionar em `shared/components/`
- [ ] Documentar uso
- [ ] Reutilizável em outras features

---

## 🧪 Testing

### Backend

- [ ] **Unit tests** para entities (100%)
- [ ] **Unit tests** para use cases (100%)
- [ ] **Integration tests** para repositories (opcional)
- [ ] **E2E tests** para endpoints (opcional)

```bash
cd backend
npm test -- <feature>
npm run test:coverage
```

**Target:** ≥ 80% coverage total

### Frontend

- [ ] **Component tests** (React Testing Library)
- [ ] **Hook tests** (renderHook)
- [ ] **Service tests** (mock API)
- [ ] **E2E tests** (Playwright/Cypress - opcional)

```bash
cd frontend
npm test -- <Feature>
npm run test:coverage
```

**Target:** ≥ 70% coverage total

---

## 📝 Documentation

### Code Documentation

- [ ] JSDoc em funções públicas complexas
- [ ] README da feature (se grande)
- [ ] Comentários explicativos (onde necessário)

### API Documentation

- [ ] Swagger decorators nos controllers
- [ ] Exemplos de request/response
- [ ] Error codes documentados

### User Documentation

- [ ] README principal atualizado
- [ ] CHANGELOG atualizado
- [ ] Screenshots (se UI)

---

## ✅ Quality Checks

### Arquitetura

```bash
/arch-validate
```

- [ ] Domain não importa infrastructure
- [ ] Application não importa infrastructure
- [ ] Sem cross-module imports (frontend)

### Code Quality

```bash
/pre-commit
```

- [ ] Lint passed
- [ ] Tests passed
- [ ] Type-check passed
- [ ] Format applied

### Manual Testing

- [ ] Happy path funciona
- [ ] Error cases tratados
- [ ] Edge cases cobertos
- [ ] Performance aceitável

---

## 🚀 Pre-Deploy

### Database

- [ ] Migration testada localmente
- [ ] Migration testada em staging
- [ ] Backup realizado (se produção)
- [ ] Rollback plan documentado

### Code Review

- [ ] Self-review completo
- [ ] PR criado
- [ ] Reviewers adicionados
- [ ] CI/CD passing

**Checklist:** Use [pr-review.md](./pr-review.md)

---

## 📦 Deployment

### Staging

- [ ] Deploy em staging
- [ ] Testes manuais em staging
- [ ] Testes E2E em staging (se houver)
- [ ] Performance check

### Production

- [ ] Approval obtida
- [ ] Deploy em produção
- [ ] Smoke tests pós-deploy
- [ ] Monitoramento ativo

---

## 🎯 Post-Deploy

### Verification

- [ ] Feature funcionando em produção
- [ ] Sem erros em logs
- [ ] Métricas normais
- [ ] Usuários conseguem usar

### Documentation

- [ ] Changelog de release
- [ ] Comunicação ao time
- [ ] Documentação de usuário (se público)

---

## 📊 Feature Checklist Summary

```bash
# Quick check - todos devem retornar ✅
/arch-validate      # ✅ Arquitetura
/pre-commit        # ✅ Quality
npm run test        # ✅ Tests

# Perguntas rápidas:
Backend completo? ✅/❌
Frontend completo? ✅/❌
Tests ≥ 80%? ✅/❌
Docs atualizadas? ✅/❌
Code review OK? ✅/❌
Deploy em staging OK? ✅/❌
```

---

## 💡 Dicas

### Use os Comandos

```bash
# Backend
/use-case <feature> <use-case-name>

# Frontend
/feature <feature-name>

# Validações
/arch-validate
/pre-commit
/db-migrate <migration-name>
```

### Templates

Copie de [patterns.md](../patterns.md):
- Domain Entity
- Use Case
- Repository
- React Component
- React Query Hooks

### Exemplo Completo

Veja [EXAMPLE-WORKFLOW.md](../EXAMPLE-WORKFLOW.md) para feature completa passo a passo.

---

**Use esta checklist para TODA nova feature!** 🎯
