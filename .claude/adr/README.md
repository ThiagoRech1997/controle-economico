# Architecture Decision Records (ADRs)

Este diretório contém os registros de decisões arquiteturais do projeto.

## 📚 O que são ADRs?

ADRs (Architecture Decision Records) documentam decisões importantes sobre a arquitetura do software, incluindo:
- **Contexto:** Por que a decisão foi necessária
- **Decisão:** O que foi decidido
- **Consequências:** Impactos da decisão

## 📋 ADRs deste Projeto

| # | Título | Status | Data |
|---|--------|--------|------|
| [001](./001-clean-architecture-adoption.md) | Adoção de Clean Architecture | Accepted | 2025-11-20 |
| [002](./002-feature-sliced-design-frontend.md) | Feature-Sliced Design no Frontend | Accepted | 2025-11-20 |
| [003](./003-sql-server-database.md) | SQL Server como Database | Accepted | 2025-11-20 |
| [004](./004-react-query-state-management.md) | React Query para Server State | Accepted | 2025-11-20 |

## 🎯 Como Criar um Novo ADR

### 1. Use o Template

Copie o [template.md](./template.md) e renomeie para `XXX-titulo-da-decisao.md`.

### 2. Preencha as Seções

- **Status:** Proposed | Accepted | Deprecated | Superseded
- **Context:** Por que esta decisão é necessária?
- **Decision:** O que foi decidido?
- **Consequences:** Quais são os impactos?

### 3. Numere Sequencialmente

Use o próximo número disponível (ex: 005, 006, etc).

### 4. Documente Aqui

Adicione à tabela acima.

## 🔄 Status dos ADRs

- **Proposed:** Ainda em discussão
- **Accepted:** Aprovado e em uso
- **Deprecated:** Não usar mais
- **Superseded:** Substituído por outro ADR

## 📖 Leitura Recomendada

- [ADR GitHub](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

---

**Documente decisões importantes!** Ajuda o time a entender o "por quê". 📝
