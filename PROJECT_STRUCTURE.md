# 📂 Estrutura Completa do Projeto

## Visão Geral da Organização

```
controle-economico/
│
├── 📖 README.md                              # Documentação principal
├── 📁 .github/                               # Configurações do GitHub
│   └── FUNDING.yml
├── 📁 .vscode/                               # Configurações do VS Code
│   └── settings.json
│
├── 📚 docs/                                  # Documentação do projeto
│   ├── README.md                             # Índice da documentação
│   ├── ARCHITECTURE.md                       # Arquitetura detalhada
│   ├── QUICK_START.md                        # Guia de início rápido
│   └── FILES_CREATED.md                      # Lista de arquivos
│
├── 🔧 backend/                               # Backend NestJS + Prisma
│   ├── prisma/
│   │   └── schema.prisma                     # Schema do banco de dados
│   │
│   ├── src/
│   │   ├── 🎯 domain/                        # Camada de Domínio (Clean Architecture)
│   │   │   ├── entities/
│   │   │   │   └── transaction.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── money.vo.ts
│   │   │   │   └── transaction-type.vo.ts
│   │   │   └── repositories/
│   │   │       └── transaction.repository.interface.ts
│   │   │
│   │   ├── 📋 application/                   # Camada de Aplicação
│   │   │   ├── use-cases/
│   │   │   │   ├── transactions/
│   │   │   │   │   └── create-transaction.use-case.ts
│   │   │   │   └── goals/
│   │   │   │       └── forecast-goal-achievement.use-case.ts
│   │   │   └── dtos/
│   │   │       ├── transactions/
│   │   │       │   ├── create-transaction.dto.ts
│   │   │       │   └── transaction-response.dto.ts
│   │   │       └── goals/
│   │   │           └── forecast-result.dto.ts
│   │   │
│   │   ├── 🔌 infrastructure/                # Camada de Infraestrutura
│   │   │   ├── persistence/
│   │   │   │   └── prisma/
│   │   │   │       ├── repositories/
│   │   │   │       │   └── prisma-transaction.repository.ts
│   │   │   │       └── mappers/
│   │   │   │           └── transaction.mapper.ts
│   │   │   ├── http/
│   │   │   │   └── controllers/
│   │   │   │       └── transactions.controller.ts
│   │   │   └── modules/
│   │   │       └── transaction.module.ts
│   │   │
│   │   ├── main.ts                           # Bootstrap da aplicação
│   │   └── app.module.ts                     # Módulo raiz
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   └── .gitignore
│
└── 🎨 frontend/                              # Frontend Next.js
    ├── src/
    │   ├── 🚀 app/                           # Next.js App Router
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── providers.tsx
    │   │   └── transactions/
    │   │       └── page.tsx
    │   │
    │   ├── 📦 modules/                       # Módulos de Features
    │   │   └── transactions/
    │   │       ├── types/
    │   │       │   └── transaction.types.ts
    │   │       ├── services/
    │   │       │   └── transaction.service.ts
    │   │       ├── hooks/
    │   │       │   ├── use-transactions.ts
    │   │       │   └── use-create-transaction.ts
    │   │       └── components/
    │   │           ├── transaction-form.tsx
    │   │           └── transaction-list.tsx
    │   │
    │   ├── 🔧 shared/                        # Componentes e utilitários compartilhados
    │   │   ├── components/
    │   │   │   └── ui/
    │   │   │       ├── button.tsx
    │   │   │       ├── input.tsx
    │   │   │       ├── card.tsx
    │   │   │       ├── select.tsx
    │   │   │       └── dialog.tsx
    │   │   └── lib/
    │   │       ├── api-client.ts
    │   │       └── utils.ts
    │   │
    │   └── styles/
    │       └── globals.css
    │
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── .env.example
    └── .gitignore
```

---

## 🎨 Código de Cores e Ícones

| Ícone | Significado |
|-------|-------------|
| 📖 | Documentação principal |
| 📚 | Pasta de documentação |
| 🔧 | Configuração / Backend |
| 🎨 | Frontend / UI |
| 🎯 | Camada de Domínio |
| 📋 | Camada de Aplicação |
| 🔌 | Camada de Infraestrutura |
| 🚀 | Roteamento |
| 📦 | Módulos de features |

---

## 📊 Estatísticas do Projeto

### Estrutura Geral
- **Total de pastas raiz**: 4 (docs, backend, frontend, .github)
- **Total de arquivos de config**: 15+
- **Arquivos de documentação**: 4

### Backend (Clean Architecture)
- **Camadas**: 3 (Domain, Application, Infrastructure)
- **Entidades**: 1
- **Value Objects**: 2
- **Use Cases**: 2
- **Repositories**: 1 interface + 1 implementação
- **Controllers**: 1

### Frontend (Modular)
- **Módulos**: 1 (Transactions)
- **Componentes UI**: 5
- **Hooks personalizados**: 2
- **Services**: 1
- **Páginas**: 2

---

## 🔄 Fluxo de Dependências

### Backend
```
Controller (Infrastructure)
    ↓
Use Case (Application)
    ↓
Repository Interface (Domain)
    ↑
Repository Implementation (Infrastructure)
```

### Frontend
```
Page (App Router)
    ↓
Component (Module)
    ↓
Hook (React Query)
    ↓
Service (API Client)
    ↓
API Client (Shared)
```

---

## 📝 Convenções de Nomenclatura

### Backend
- **Entities**: `*.entity.ts`
- **Value Objects**: `*.vo.ts`
- **DTOs**: `*.dto.ts`
- **Use Cases**: `*.use-case.ts`
- **Repositories**: `*.repository.ts` ou `*.repository.interface.ts`
- **Controllers**: `*.controller.ts`
- **Modules**: `*.module.ts`

### Frontend
- **Components**: PascalCase (e.g., `TransactionForm.tsx`)
- **Hooks**: camelCase com prefixo `use` (e.g., `useTransactions.ts`)
- **Services**: camelCase com sufixo `.service.ts`
- **Types**: PascalCase com sufixo `.types.ts`
- **Stores**: camelCase com sufixo `.store.ts`

---

## 🎯 Áreas de Expansão

### Próximos Módulos Backend
```
backend/src/
├── domain/
│   ├── entities/
│   │   ├── account.entity.ts      ⏳ Pendente
│   │   ├── category.entity.ts     ⏳ Pendente
│   │   ├── goal.entity.ts         ⏳ Pendente
│   │   └── user.entity.ts         ⏳ Pendente
```

### Próximos Módulos Frontend
```
frontend/src/modules/
├── dashboard/                      ⏳ Pendente
├── goals/                          ⏳ Pendente
├── accounts/                       ⏳ Pendente
├── categories/                     ⏳ Pendente
└── reports/                        ⏳ Pendente
```

---

## 🚀 Como Navegar no Projeto

1. **Início**: Comece pelo [README.md](./README.md)
2. **Documentação**: Explore a pasta [docs/](./docs/)
3. **Backend**: Comece por `backend/src/domain/`
4. **Frontend**: Comece por `frontend/src/app/`
5. **Exemplos**: Veja o módulo `transactions/` completo

---

**Última atualização**: 2025-01-20

[⬅️ Voltar para o README](./README.md) | [📚 Ver Documentação](./docs/README.md)
