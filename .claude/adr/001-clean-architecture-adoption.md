# ADR 001: Adoção de Clean Architecture no Backend

**Status:** Accepted
**Date:** 2025-11-20
**Deciders:** Equipe de desenvolvimento
**Related ADRs:** N/A

## Context

O sistema de controle econômico precisa de uma arquitetura que:
- Seja fácil de testar
- Seja independente de frameworks
- Permita mudanças de tecnologia sem reescrever tudo
- Escale com o crescimento do projeto
- Seja clara para novos desenvolvedores

Arquiteturas tradicionais (MVC, Layered) tendem a misturar lógica de negócio com detalhes de implementação, tornando o código difícil de testar e manter.

## Decision

Adotamos **Clean Architecture (Hexagonal Architecture)** para o backend NestJS.

### Estrutura de Camadas

```
backend/src/
├── domain/               # Lógica de negócio pura
│   ├── entities/        # Entidades de negócio
│   └── repositories/    # Interfaces (portas)
├── application/         # Casos de uso
│   ├── dtos/           # Input/Output
│   └── use-cases/      # Lógica de aplicação
└── infrastructure/      # Adaptadores
    ├── persistence/     # Implementações Prisma
    ├── http/           # Controllers NestJS
    └── modules/        # DI NestJS
```

### Regra de Dependência

**Fluxo:** `domain` ← `application` ← `infrastructure`

- **Domain** não depende de nada (zero imports externos)
- **Application** depende apenas de **domain**
- **Infrastructure** depende de **domain** e **application**

## Alternatives Considered

### Alternative 1: Layered Architecture (tradicional)

**Pros:**
- Familiar para maioria dos devs
- Simples de implementar
- Menos boilerplate inicial

**Cons:**
- Lógica de negócio misturada com framework
- Difícil de testar sem banco de dados
- Acoplamento forte com ORM
- Dificuldade para mudar tecnologia

**Razão para rejeitar:** Queremos independência de framework e testabilidade máxima.

### Alternative 2: Domain-Driven Design (DDD) completo

**Pros:**
- Modelagem rica do domínio
- Patterns avançados (Aggregates, Value Objects, etc.)
- Linguagem ubíqua

**Cons:**
- Complexidade maior que necessário para o projeto
- Curva de aprendizado íngreme
- Overhead para domínio relativamente simples

**Razão para rejeitar:** Clean Architecture oferece 80% dos benefícios com 20% da complexidade.

### Alternative 3: NestJS padrão (sem arquitetura específica)

**Pros:**
- Rápido para começar
- Menos arquivos
- Documentação abundante

**Cons:**
- Acoplamento com NestJS
- Difícil de testar sem framework
- Cresce desorganizado
- Lógica de negócio em controllers/services

**Razão para rejeitar:** Não escala bem. Manutenção difícil a longo prazo.

## Consequences

### Positive

- **Testabilidade:** Testes unitários puros no domain, sem mocks complexos
- **Independência:** Podemos trocar NestJS, Prisma, SQL Server sem reescrever domain
- **Clareza:** Separação clara de responsabilidades
- **Escalabilidade:** Fácil adicionar novas features
- **Onboarding:** Novos devs entendem a estrutura rapidamente

### Negative

- **Boilerplate:** Mais arquivos por feature (entity, repository interface, impl, mapper, etc.)
- **Curva de aprendizado:** Devs precisam entender camadas e fluxo de dependências
- **Overhead inicial:** Features simples parecem "over-engineered"

### Neutral

- **Número de arquivos:** ~7-8 arquivos por feature completa
- **Abstrações:** Uso de interfaces e DI (já familiar em NestJS)

## Implementation

### Passos

1. ✅ Estrutura de pastas criada
2. ✅ Templates documentados em `.claude/patterns.md`
3. ✅ Comandos criados (`/use-case`)
4. ✅ Validação automática (`/arch-validate`)
5. ✅ Exemplos criados (Transaction, Goal, Account)

### Métricas de Sucesso

- [ ] 100% dos use cases testáveis sem DB
- [ ] Domain layer sem imports externos
- [ ] Arquitetura validada em CI/CD

### Responsáveis

- Equipe completa

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [NestJS Clean Architecture](https://dev.to/rubiin/clean-architecture-with-nestjs-1cdf)

## Notes

### Decisões Específicas

**Por que não Aggregates?**
- Domínio é simples (CRUD + business rules básicas)
- Entities simples são suficientes
- Podemos evoluir para Aggregates se necessário

**Por que Prisma?**
- ORMs modernos (Prisma, TypeORM) são bons adaptadores
- Fácil isolar via Repository pattern
- Decidido em ADR 003

**E os Value Objects?**
- Usamos onde faz sentido (Money, TransactionType, etc.)
- Não forçamos VO para tudo
- Pragmatismo > purismo

---

**Última atualização:** 2025-11-20
**Próxima revisão:** Após 3 meses de uso
