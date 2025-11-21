# 🗺️ Roadmap - Sistema de Controle Econômico

> **Planejamento de desenvolvimento e funcionalidades futuras**

---

## 📊 Status Atual (v1.3.0)

### ✅ Implementado

#### Backend
- [x] Estrutura Clean Architecture (Hexagonal)
- [x] Schema Prisma completo (SQL Server)
- [x] **PrismaService & PrismaModule** (global)
- [x] **Authentication Module** (completo - backend)
  - [x] User Entity com regras de negócio
  - [x] Email Value Object com validação
  - [x] User Repository Interface + Implementação Prisma
  - [x] RegisterUserUseCase (com bcrypt)
  - [x] LoginUserUseCase (com JWT)
  - [x] ValidateTokenUseCase
  - [x] RefreshTokenUseCase
  - [x] AuthController com Swagger
  - [x] JWT Strategy (Passport)
  - [x] JwtAuthGuard
  - [x] AuthModule com DI completo
- [x] **Accounts Module** (completo - backend)
  - [x] Account Entity com regras de negócio
  - [x] Value Objects (AccountType, Currency)
  - [x] Account Repository Interface + Implementação Prisma
  - [x] 5 Use Cases (Create, Update, Delete, List, GetBalance)
  - [x] AccountsController com Swagger
  - [x] AccountModule com DI completo
- [x] **Categories Module** (completo - backend)
  - [x] Category Entity com regras de negócio
  - [x] CategoryType (INCOME, EXPENSE)
  - [x] Category Repository Interface + Implementação Prisma
  - [x] 4 Use Cases (Create, Update, Delete, List)
  - [x] CategoriesController com Swagger
  - [x] CategoryModule com DI completo
- [x] **Transactions Module** (completo)
  - [x] Transaction Entity com regras de negócio
  - [x] Value Objects (Money, TransactionType)
  - [x] CreateTransactionUseCase
  - [x] Repository Interface + Implementação Prisma
  - [x] Controller REST
  - [x] Module NestJS com DI

#### Frontend
- [x] Estrutura Modular (Feature-Sliced Design)
- [x] **Transactions Module** (completo)
  - [x] Components (Form, List)
  - [x] Hooks React Query
  - [x] Services (API Client)
  - [x] Types TypeScript

#### Infraestrutura
- [x] Configuração completa (backend + frontend)
- [x] Documentação organizada
- [x] Componentes UI básicos (Shadcn/UI)
- [x] JWT configurado (access + refresh tokens)

---

## 🎯 Fases de Desenvolvimento

### 📦 Fase 1: Core Features (Prioridade Alta 🔴)

**Objetivo**: Implementar funcionalidades essenciais para o sistema funcionar end-to-end

#### 1.1 Users & Authentication Module 👤

**Backend:**
```
backend/src/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── value-objects/
│   │   └── email.vo.ts
│   └── repositories/
│       └── user.repository.interface.ts
├── application/
│   ├── use-cases/auth/
│   │   ├── register-user.use-case.ts
│   │   ├── login-user.use-case.ts
│   │   ├── validate-token.use-case.ts
│   │   └── refresh-token.use-case.ts
│   └── dtos/auth/
│       ├── register-user.dto.ts
│       ├── login.dto.ts
│       └── auth-response.dto.ts
└── infrastructure/
    ├── persistence/prisma/repositories/
    │   └── prisma-user.repository.ts
    ├── http/
    │   ├── controllers/
    │   │   └── auth.controller.ts
    │   └── guards/
    │       └── jwt-auth.guard.ts
    └── modules/
        └── auth.module.ts
```

**Frontend:**
```
frontend/src/modules/auth/
├── components/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── protected-route.tsx
├── hooks/
│   ├── use-login.ts
│   ├── use-register.ts
│   └── use-auth.ts
├── services/
│   └── auth.service.ts
└── types/
    └── auth.types.ts
```

**Features:**
- [x] Registro de usuários com validação de email ✅
- [x] Login com JWT (access + refresh tokens) ✅
- [x] Autenticação em todas as rotas protegidas ✅
- [x] Guard (JwtAuthGuard) no backend ✅
- [ ] Protected routes no frontend (pendente)
- [ ] Logout e limpeza de tokens (pendente - frontend)
- [x] Password hashing (bcrypt - 10 rounds) ✅
- [x] Token refresh mechanism ✅

**Status**: ✅ **Backend completo** | ⏳ Frontend pendente

**Estimativa**: 3-5 dias | **Tempo real**: ~2 dias (backend)

---

#### 1.2 Accounts Module 🏦

**Backend:**
```
backend/src/
├── domain/
│   ├── entities/
│   │   └── account.entity.ts
│   ├── value-objects/
│   │   ├── account-type.vo.ts
│   │   └── currency.vo.ts
│   └── repositories/
│       └── account.repository.interface.ts
├── application/
│   ├── use-cases/accounts/
│   │   ├── create-account.use-case.ts
│   │   ├── update-account.use-case.ts
│   │   ├── delete-account.use-case.ts
│   │   ├── list-accounts.use-case.ts
│   │   └── get-account-balance.use-case.ts
│   └── dtos/accounts/
│       ├── create-account.dto.ts
│       └── account-response.dto.ts
└── infrastructure/
    ├── persistence/prisma/repositories/
    │   └── prisma-account.repository.ts
    ├── http/controllers/
    │   └── accounts.controller.ts
    └── modules/
        └── account.module.ts
```

**Frontend:**
```
frontend/src/modules/accounts/
├── components/
│   ├── account-list.tsx
│   ├── account-card.tsx
│   ├── account-form.tsx
│   └── balance-summary.tsx
├── hooks/
│   ├── use-accounts.ts
│   ├── use-create-account.ts
│   └── use-account-balance.ts
├── services/
│   └── account.service.ts
└── types/
    └── account.types.ts
```

**Features:**
- [x] CRUD completo de contas ✅
- [x] Tipos de conta (CHECKING, SAVINGS, CASH, INVESTMENT) ✅
- [x] Cálculo automático de saldo (initialBalance + transações) ✅
- [x] Multi-moedas (BRL, USD, EUR) ✅
- [x] Ativar/desativar contas ✅
- [x] Validação: não permitir deletar conta com transações ✅
- [ ] Frontend components (pendente)

**Status**: ✅ **Backend completo** | ⏳ Frontend pendente

**Estimativa**: 2-3 dias | **Tempo real**: ~1 dia (backend)

---

#### 1.3 Categories Module 📂

**Backend:**
```
backend/src/
├── domain/
│   ├── entities/
│   │   └── category.entity.ts
│   └── repositories/
│       └── category.repository.interface.ts
├── application/
│   ├── use-cases/categories/
│   │   ├── create-category.use-case.ts
│   │   ├── update-category.use-case.ts
│   │   ├── delete-category.use-case.ts
│   │   └── list-categories.use-case.ts
│   └── dtos/categories/
│       ├── create-category.dto.ts
│       └── category-response.dto.ts
└── infrastructure/
    ├── persistence/prisma/repositories/
    │   └── prisma-category.repository.ts
    ├── http/controllers/
    │   └── categories.controller.ts
    └── modules/
        └── category.module.ts
```

**Frontend:**
```
frontend/src/modules/categories/
├── components/
│   ├── category-list.tsx
│   ├── category-form.tsx
│   ├── category-selector.tsx
│   └── category-badge.tsx
├── hooks/
│   ├── use-categories.ts
│   └── use-create-category.ts
├── services/
│   └── category.service.ts
└── types/
    └── category.types.ts
```

**Features:**
- [x] CRUD de categorias personalizadas ✅
- [x] Flag: Essential (fixed costs) vs Non-Essential ✅
- [x] Tipo: INCOME ou EXPENSE ✅
- [x] Ícones e cores customizáveis ✅
- [ ] Categorias padrão (seed) - pendente
- [x] Validação: não permitir deletar categoria em uso ✅
- [ ] Frontend components (pendente)

**Status**: ✅ **Backend completo** | ⏳ Frontend pendente

**Estimativa**: 2-3 dias | **Tempo real**: ~1 dia (backend)

---

### 🚀 Fase 2: Advanced Features (Prioridade Média 🟡)

#### 2.1 Goals Module 🎯

**Backend:**
```
backend/src/
├── domain/
│   ├── entities/
│   │   └── goal.entity.ts
│   └── repositories/
│       └── goal.repository.interface.ts
├── application/
│   ├── use-cases/goals/
│   │   ├── create-goal.use-case.ts
│   │   ├── update-goal.use-case.ts
│   │   ├── update-goal-progress.use-case.ts
│   │   ├── complete-goal.use-case.ts
│   │   ├── forecast-goal-achievement.use-case.ts (JÁ EXISTE!)
│   │   └── list-goals.use-case.ts
│   └── dtos/goals/
│       ├── create-goal.dto.ts
│       └── goal-response.dto.ts
└── infrastructure/
    ├── persistence/prisma/repositories/
    │   └── prisma-goal.repository.ts
    ├── http/controllers/
    │   └── goals.controller.ts
    └── modules/
        └── goal.module.ts
```

**Frontend:**
```
frontend/src/modules/goals/
├── components/
│   ├── goal-list.tsx
│   ├── goal-card.tsx
│   ├── goal-form.tsx
│   ├── goal-progress-bar.tsx
│   └── forecast-widget.tsx
├── hooks/
│   ├── use-goals.ts
│   ├── use-forecast.ts
│   └── use-update-goal.ts
├── services/
│   └── goal.service.ts
└── types/
    └── goal.types.ts
```

**Features:**
- [ ] CRUD de metas financeiras
- [ ] Progresso manual (currentValue)
- [ ] Forecasting automático (já implementado parcialmente!)
- [ ] Status: IN_PROGRESS, COMPLETED, CANCELLED
- [ ] Visualização de progresso (%)
- [ ] Data estimada de conquista

**Estimativa**: 3-4 dias

---

#### 2.2 Dashboard Module 📊

**Backend:**
```
backend/src/application/use-cases/dashboard/
├── get-summary.use-case.ts
├── get-recent-transactions.use-case.ts
└── get-monthly-comparison.use-case.ts
```

**Frontend:**
```
frontend/src/modules/dashboard/
├── components/
│   ├── dashboard-container.tsx
│   ├── summary-cards.tsx
│   ├── monthly-chart.tsx
│   ├── category-pie-chart.tsx
│   └── recent-transactions-widget.tsx
├── hooks/
│   └── use-dashboard-data.ts
└── types/
    └── dashboard.types.ts
```

**Features:**
- [ ] Cards de resumo (receitas, despesas, saldo)
- [ ] Gráfico de evolução mensal
- [ ] Gráfico de distribuição por categoria (pizza)
- [ ] Transações recentes
- [ ] Metas em destaque

**Bibliotecas**: Recharts ou Chart.js

**Estimativa**: 4-5 dias

---

#### 2.3 Reports Module 📈

**Backend:**
```
backend/src/application/use-cases/reports/
├── get-monthly-summary.use-case.ts
├── get-yearly-summary.use-case.ts
├── get-cash-flow.use-case.ts
├── get-category-analysis.use-case.ts
└── export-to-excel.use-case.ts
```

**Frontend:**
```
frontend/src/modules/reports/
├── components/
│   ├── report-filters.tsx
│   ├── monthly-report.tsx
│   ├── yearly-report.tsx
│   └── export-button.tsx
├── hooks/
│   ├── use-reports.ts
│   └── use-export.ts
└── types/
    └── report.types.ts
```

**Features:**
- [ ] Relatório mensal consolidado
- [ ] Relatório anual
- [ ] Análise por categoria
- [ ] Fluxo de caixa
- [ ] Exportação Excel
- [ ] Exportação PDF
- [ ] Filtros avançados (período, conta, categoria)

**Bibliotecas**: ExcelJS, jsPDF

**Estimativa**: 5-6 dias

---

#### 2.4 Transactions Enhancement 💰

**Melhorias no módulo existente:**

- [ ] Update e Delete de transações
- [ ] Filtros avançados (múltiplas contas, categorias)
- [ ] Busca por descrição
- [ ] Ordenação customizável
- [ ] Anexos (notas fiscais, recibos)
- [ ] Tags personalizadas

**Estimativa**: 2-3 dias

---

### 🌟 Fase 3: Nice to Have (Prioridade Baixa 🟢)

#### 3.1 Recurring Transactions 🔄

**Features:**
- [ ] Transações recorrentes (diária, semanal, mensal, anual)
- [ ] Criação automática por scheduler
- [ ] Editar/pausar recorrências
- [ ] Previsão de transações futuras

**Estimativa**: 4-5 dias

---

#### 3.2 Budgets (Orçamentos) 💼

**Features:**
- [ ] Criar orçamentos mensais por categoria
- [ ] Alertas quando ultrapassar limite
- [ ] Comparação: planejado vs real
- [ ] Sugestões de economia

**Estimativa**: 4-5 dias

---

#### 3.3 Notifications 🔔

**Features:**
- [ ] Notificações de vencimento
- [ ] Alertas de orçamento
- [ ] Notificações de metas próximas de serem atingidas
- [ ] Email notifications
- [ ] Push notifications (PWA)

**Estimativa**: 3-4 dias

---

#### 3.4 Multi-Currency Advanced 💱

**Features:**
- [ ] Conversão automática de moedas
- [ ] Cotações em tempo real (API externa)
- [ ] Histórico de taxas de câmbio
- [ ] Consolidação multi-moedas

**Estimativa**: 3-4 dias

---

#### 3.5 Bank Integration (Open Banking) 🏦

**Features:**
- [ ] Integração com APIs bancárias
- [ ] Importação automática de transações
- [ ] Sincronização de saldo
- [ ] Categorização automática

**Estimativa**: 10-15 dias (complexo)

---

#### 3.6 Mobile App 📱

**Features:**
- [ ] PWA (Progressive Web App)
- [ ] Ou React Native
- [ ] Todas as funcionalidades do web
- [ ] Câmera para escanear recibos
- [ ] Notificações push

**Estimativa**: 15-20 dias

---

## 📅 Timeline Estimado

### Q1 2025 (Janeiro - Março)
- ✅ Fase 0: Setup inicial (COMPLETO)
- 🟡 Fase 1: Core Features
  - Janeiro: Auth + Accounts
  - Fevereiro: Categories + Goals
  - Março: Ajustes e testes

### Q2 2025 (Abril - Junho)
- 🟡 Fase 2: Advanced Features
  - Abril: Dashboard
  - Maio: Reports
  - Junho: Transaction Enhancements

### Q3 2025 (Julho - Setembro)
- 🟢 Fase 3: Nice to Have
  - Julho: Recurring Transactions + Budgets
  - Agosto: Notifications + Multi-Currency
  - Setembro: Planejamento Bank Integration

### Q4 2025 (Outubro - Dezembro)
- 🟢 Fase 3 continuação
  - Outubro-Novembro: Bank Integration
  - Dezembro: Mobile App (início)

---

## 🎯 Priorização (Método MoSCoW)

### Must Have (Essencial) 🔴
1. Authentication & Users
2. Accounts
3. Categories
4. Basic Transactions (CRUD completo)

### Should Have (Importante) 🟡
5. Goals
6. Dashboard
7. Reports
8. Transaction Enhancements

### Could Have (Desejável) 🟢
9. Recurring Transactions
10. Budgets
11. Notifications
12. Multi-Currency Advanced

### Won't Have (Por Enquanto) ⚪
13. Bank Integration (muito complexo no início)
14. Mobile App (após web estável)

---

## 🔧 Dívida Técnica e Melhorias

### Backend
- [ ] Implementar validação com class-validator em todos os DTOs
- [ ] Adicionar logs estruturados (Winston ou Pino)
- [ ] Implementar rate limiting
- [ ] Adicionar health checks
- [ ] Swagger/OpenAPI documentation
- [ ] Error handling global
- [ ] Request/Response interceptors

### Frontend
- [ ] Implementar Error Boundaries
- [ ] Loading states globais
- [ ] Toast notifications (react-hot-toast)
- [ ] Dark mode
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (a11y)
- [ ] PWA configuration

### DevOps
- [ ] Docker Compose (backend + db + frontend)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Testes automatizados (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Deployment scripts
- [ ] Environment configs por ambiente

### Segurança
- [ ] Rate limiting
- [ ] CORS configurado corretamente
- [ ] SQL injection prevention (Prisma já ajuda)
- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] Helmet.js
- [ ] Input sanitization

---

## 📊 Métricas de Sucesso

- [ ] 100% dos módulos core implementados
- [ ] Cobertura de testes > 80%
- [ ] Performance: API response < 200ms (95º percentil)
- [ ] Zero vulnerabilidades críticas (npm audit)
- [ ] Documentação atualizada

---

## 🤝 Como Contribuir

Quer ajudar a implementar alguma feature do roadmap?

1. Escolha uma feature da lista
2. Crie uma issue no GitHub
3. Faça um fork e crie uma branch: `feature/nome-da-feature`
4. Siga a arquitetura existente (Clean Architecture)
5. Adicione testes
6. Abra um Pull Request

---

## 📝 Notas

- Este roadmap é flexível e pode ser ajustado conforme necessidades
- Estimativas são aproximadas e podem variar
- Prioridades podem mudar baseado em feedback
- Versões serão lançadas incrementalmente

---

**Última atualização**: 2025-01-21
**Versão do Roadmap**: 1.3
**Próxima revisão**: 2025-02-01

---

[⬅️ Voltar para Documentação](./README.md) | [📖 README Principal](../README.md)
