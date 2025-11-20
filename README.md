# Sistema de Controle Econômico

Sistema robusto de controle financeiro pessoal construído com Clean Architecture (Hexagonal) no backend e Arquitetura Modular no frontend.

## 🏗️ Arquitetura

### Backend (NestJS)
- **Arquitetura**: Hexagonal (Ports & Adapters) / Clean Architecture
- **Database**: SQL Server (via Prisma ORM)
- **Camadas**:
  - `domain/`: Lógica de negócio pura (sem dependências de frameworks)
  - `application/`: Casos de uso e DTOs
  - `infrastructure/`: Adaptadores (Prisma, NestJS Controllers, etc.)

### Frontend (Next.js)
- **Arquitetura**: Modular / Feature-Sliced Design
- **UI**: Tailwind CSS + Shadcn/UI
- **State Management**:
  - React Query (estado do servidor)
  - Zustand (estado global)
- **Estrutura**:
  - `app/`: Roteamento apenas (App Router)
  - `modules/`: Módulos de features independentes
  - `shared/`: Componentes e utilitários compartilhados

## 📋 Pré-requisitos

- Node.js 18+
- SQL Server 2019+ ou Azure SQL Database
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd controle-economico
```

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas configurações do SQL Server
# DATABASE_URL="sqlserver://localhost:1433;database=controle_economico;user=sa;password=SuaSenha;encrypt=true;trustServerCertificate=true"
```

#### Configurar Prisma e Database

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar o banco de dados e executar migrations
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para visualizar dados
npm run prisma:studio
```

#### Executar Backend

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

O backend estará rodando em: `http://localhost:3001`

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Edite o arquivo .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

#### Executar Frontend

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm run start
```

O frontend estará rodando em: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
controle-economico/
├── backend/                           # Backend NestJS
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── domain/                    # Lógica de negócio pura
│       ├── application/               # Casos de uso
│       └── infrastructure/            # Adaptadores
├── frontend/                          # Frontend Next.js
│   └── src/
│       ├── app/                       # App Router
│       ├── modules/                   # Features modulares
│       └── shared/                    # Componentes compartilhados
└── docs/                              # Documentação
    ├── ARCHITECTURE.md                # Arquitetura detalhada
    ├── QUICK_START.md                 # Guia rápido
    └── FILES_CREATED.md               # Índice de arquivos
```

## 🎯 Funcionalidades

### ✅ Implementadas

1. **Gerenciamento de Transações**
   - Criar, editar e excluir receitas/despesas
   - Categorização (Essencial vs Não-Essencial)
   - Status de pagamento (Pago/Pendente)
   - Filtros e paginação

2. **Forecasting de Metas**
   - Cálculo de superávit mensal médio
   - Previsão de data de conquista de metas
   - Análise de viabilidade

### 🚧 Próximas Features

- [ ] Autenticação JWT
- [ ] Dashboard com gráficos
- [ ] Relatórios e analytics
- [ ] Planejamento de orçamento
- [ ] Transações recorrentes
- [ ] Multi-moedas
- [ ] Exportação para Excel/PDF

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend

```bash
cd frontend

# Testes unitários
npm run test

# Testes E2E (Playwright)
npm run test:e2e
```

## 📚 Documentação

- 📖 [Guia Rápido de Início](./docs/QUICK_START.md) - Comece em 5 minutos
- 🏗️ [Arquitetura Completa](./docs/ARCHITECTURE.md) - Detalhes da arquitetura do sistema
- 📋 [Índice de Arquivos](./docs/FILES_CREATED.md) - Lista de todos os arquivos criados
- 🗺️ [Roadmap do Projeto](./docs/ROADMAP.md) - Funcionalidades planejadas e timeline
- 🔌 [Backend API Docs](http://localhost:3001/api/v1) - Documentação Swagger (quando implementada)

## 🛠️ Tecnologias

### Backend
- NestJS
- Prisma ORM
- SQL Server
- TypeScript
- Class Validator
- UUID

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Query
- Zustand
- React Hook Form

## 📝 Princípios Arquiteturais

### Backend (Clean Architecture)

1. **Independência de Frameworks**: A lógica de negócio não depende de NestJS ou Prisma
2. **Testabilidade**: Camadas puras podem ser testadas isoladamente
3. **Independência de UI**: O backend pode servir múltiplos frontends
4. **Independência de Database**: Fácil trocar SQL Server por outro DB

### Frontend (Modular)

1. **Feature Isolation**: Cada módulo é independente
2. **Reusabilidade**: Componentes compartilhados em `shared/`
3. **Lazy Loading**: Módulos podem ser carregados sob demanda
4. **Separation of Concerns**: Roteamento separado de lógica de negócio

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 👨‍💻 Autor

Seu Nome

---

**Nota**: Este projeto é um exemplo de implementação de Clean Architecture e pode ser usado como base para sistemas mais complexos.
