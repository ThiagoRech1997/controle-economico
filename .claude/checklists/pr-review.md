# Checklist: Pull Request Review

Use esta checklist ao revisar Pull Requests neste projeto.

## 📋 Informações do PR

- **PR #:** ___________
- **Autor:** ___________
- **Data:** ___________
- **Branch:** ___________ → main
- **Tipo:** [ ] Feature [ ] Bugfix [ ] Refactor [ ] Docs

---

## 🏗️ Arquitetura

### Backend (Clean Architecture)

- [ ] **Domain layer** não importa de `infrastructure` ou `application`
- [ ] **Application layer** não importa de `infrastructure`
- [ ] **Entidades** possuem apenas lógica de negócio pura
- [ ] **Repository interfaces** definidas em `domain/`
- [ ] **Repository implementations** em `infrastructure/persistence/`
- [ ] **Use cases** orquestram domain + repositories
- [ ] **Controllers** apenas chamam use cases
- [ ] **Modules** configuram DI corretamente

**Comando:** `/arch-validate`

### Frontend (Feature-Sliced Design)

- [ ] Módulo está em `modules/<feature>/`
- [ ] Sem cross-module imports
- [ ] React Query para server state
- [ ] Zustand apenas para global state (se necessário)
- [ ] Componentes são pure UI
- [ ] Business logic em services/hooks

**Comando:** `/arch-validate`

---

## 💻 Código

### Qualidade

- [ ] Lint passou sem erros (`npm run lint`)
- [ ] Format aplicado (`npm run format`)
- [ ] Type-check OK (`npm run type-check`)
- [ ] Sem `any` types (exceto onde absolutamente necessário)
- [ ] Sem `console.log` em produção
- [ ] Sem código comentado (remover)

**Comando:** `/pre-commit`

### Naming & Conventions

- [ ] **Use cases:** `<Action><Entity>UseCase`
- [ ] **Repositories:** `<Entity>Repository` (interface), `Prisma<Entity>Repository` (impl)
- [ ] **DTOs:** `<Entity><Action>Dto`
- [ ] **Controllers:** `<entity>.controller.ts`
- [ ] **Components:** `PascalCase.tsx`
- [ ] **Hooks:** `use-kebab-case.ts`
- [ ] **Services:** `kebab-case.service.ts`

### Complexidade

- [ ] Funções < 50 linhas
- [ ] Classes < 300 linhas
- [ ] Arquivos < 500 linhas
- [ ] Complexidade ciclomática razoável
- [ ] Nenhum "god object" ou "god function"

---

## 🧪 Testes

### Coverage

- [ ] **Coverage geral:** ≥ 80%
- [ ] **Use cases:** 100% (obrigatório)
- [ ] **Domain entities:** ≥ 90%
- [ ] **Repositories:** ≥ 80%
- [ ] **Components:** ≥ 70%

**Comando:** `npm run test:coverage`

### Qualidade dos Testes

- [ ] Testes unitários para use cases
- [ ] Testes de integração (se aplicável)
- [ ] Mocks corretos e atualizados
- [ ] Nomes descritivos (`it('should...')`)
- [ ] Testa casos de sucesso
- [ ] Testa casos de erro
- [ ] Testa edge cases
- [ ] Sem testes flaky (intermitentes)

### Específico

- [ ] Use cases testados com mocks
- [ ] Repositories testados (ou com in-memory, ou integração)
- [ ] Components testados com React Testing Library
- [ ] Hooks testados com renderHook

---

## 🗄️ Database

### Migrations (se aplicável)

- [ ] Migration tem nome descritivo
- [ ] Migration testada localmente
- [ ] Migration é reversível (down script)
- [ ] Schema.prisma atualizado
- [ ] Prisma Client regenerado
- [ ] Sem alterações breaking (ou documentadas)
- [ ] Índices criados onde necessário

**Comando:** `/db-migrate <nome>`

### Performance

- [ ] Queries otimizadas (sem N+1)
- [ ] Índices apropriados
- [ ] Sem `select *` desnecessário
- [ ] Paginação implementada (listas grandes)

---

## 🔐 Segurança

### Autenticação/Autorização

- [ ] Endpoints protegidos (guards/middleware)
- [ ] Validação de ownership (user só vê seus dados)
- [ ] Sem dados sensíveis em logs
- [ ] Sem secrets hardcoded

### Validação

- [ ] Input validation (DTOs com class-validator)
- [ ] Sanitização de inputs
- [ ] SQL injection prevention (Prisma já previne)
- [ ] XSS prevention (sanitize HTML se necessário)

### Dados Sensíveis

- [ ] Passwords hasheadas
- [ ] Tokens em environment variables
- [ ] Sem API keys no código
- [ ] `.env` no `.gitignore`

---

## 📝 Documentação

### Código

- [ ] JSDoc em funções públicas complexas
- [ ] README atualizado (se necessário)
- [ ] CHANGELOG atualizado
- [ ] Comentários explicam "por quê", não "o quê"

### API (se aplicável)

- [ ] Swagger docs atualizados
- [ ] Exemplos de request/response
- [ ] Error responses documentados

---

## ⚡ Performance

### Backend

- [ ] Sem operações síncronas bloqueantes
- [ ] Async/await usado corretamente
- [ ] Queries eficientes
- [ ] Cache implementado (se apropriado)

### Frontend

- [ ] Lazy loading de componentes (se apropriado)
- [ ] Imagens otimizadas
- [ ] Bundle size razoável
- [ ] Sem re-renders desnecessários

---

## 🌐 UI/UX (se aplicável)

### Funcionalidade

- [ ] Feature funciona conforme especificado
- [ ] Sem bugs visuais
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Acessibilidade (a11y) básica

### Estados

- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Success feedback

---

## 🔄 CI/CD

### Pipeline

- [ ] Build passa
- [ ] Testes passam
- [ ] Lint passa
- [ ] Type-check passa

### Deployment

- [ ] Migrations planejadas (se aplicável)
- [ ] Rollback plan (se necessário)
- [ ] Feature flags (se aplicável)

---

## 📊 Métricas

### Complexidade

- [ ] **Baixa:** Mudanças < 200 linhas
- [ ] **Média:** 200-500 linhas
- [ ] **Alta:** > 500 linhas (considere quebrar)

### Files Changed

- [ ] **Baixo:** < 10 arquivos
- [ ] **Médio:** 10-20 arquivos
- [ ] **Alto:** > 20 arquivos (considere quebrar)

---

## ✅ Decisão Final

### Aprovação

- [ ] **APPROVED** - Tudo OK, pode fazer merge
- [ ] **APPROVED with comments** - OK, mas considere sugestões
- [ ] **CHANGES REQUESTED** - Corrija issues antes de merge
- [ ] **NEEDS DISCUSSION** - Vamos discutir abordagem

### Comentários

```
_________________________________________________

_________________________________________________

_________________________________________________
```

---

## 📋 Checklist Rápido (TL;DR)

```bash
# Rode estes comandos:
/arch-validate        # ✅ Arquitetura OK?
/pre-commit          # ✅ Quality OK?
npm run test:coverage # ✅ Coverage OK?

# Perguntas rápidas:
- Clean Architecture respeitada? ✅/❌
- Feature-Sliced Design OK? ✅/❌
- Testes passando? ✅/❌
- Coverage ≥ 80%? ✅/❌
- Sem security issues? ✅/❌
- Documentação atualizada? ✅/❌
```

---

**Use esta checklist em TODOS os PRs!** 🎯
