# Exemplos Práticos de Uso

Este documento contém exemplos reais de como usar o Claude Code neste projeto.

## 📋 Índice

1. [Criando Uma Feature Completa](#criando-uma-feature-completa)
2. [Refatorando Código Legado](#refatorando-código-legado)
3. [Implementando Testes](#implementando-testes)
4. [Code Review](#code-review)
5. [Database Migrations](#database-migrations)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Criando Uma Feature Completa

### Cenário: Sistema de Notificações

**Objetivo:** Adicionar sistema de notificações push para lembrar o usuário de transações pendentes.

#### Passo 1: Planejamento

```
Você: Preciso criar um sistema de notificações. O que preciso fazer?

Claude: Vou ajudá-lo a criar isso seguindo Clean Architecture. Precisaremos de:

Backend:
- Domain: Entity Notification, Repository interface
- Application: Use cases (CreateNotification, SendNotification)
- Infrastructure: NotificationService (Firebase/etc), Prisma repository

Frontend:
- Módulo notifications com componentes, hooks e service

Quer que eu comece pelo backend ou frontend?
```

#### Passo 2: Backend com Comando

```bash
/use-case notifications create-notification
```

**Claude cria:**
```
✅ backend/src/domain/entities/notification.entity.ts
✅ backend/src/domain/repositories/notification.repository.interface.ts
✅ backend/src/application/dtos/notifications/create-notification.dto.ts
✅ backend/src/application/use-cases/notifications/create-notification.use-case.ts
✅ backend/src/infrastructure/persistence/prisma/repositories/prisma-notification.repository.ts
✅ backend/src/infrastructure/http/controllers/notification.controller.ts
✅ backend/src/infrastructure/modules/notification.module.ts
```

#### Passo 3: Adicionar ao Schema Prisma

```
Você: Adicione o modelo Notification ao schema.prisma

Claude: [Analisa schema atual e adiciona:]

model Notification {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  message     String
  type        String   // reminder, alert, info
  read        Boolean  @default(false)
  scheduledAt DateTime?
  sentAt      DateTime?
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([scheduledAt])
}
```

#### Passo 4: Criar Migration

```bash
/db-migrate add-notifications-table
```

**Output:**
```
✅ Schema validado
✅ Migration criada: 20251120_add_notifications_table
✅ Prisma Client gerado
```

#### Passo 5: Frontend com Comando

```bash
/feature notifications
```

**Claude cria:**
```
✅ frontend/src/modules/notifications/
    ├── components/NotificationList.tsx
    ├── components/NotificationItem.tsx
    ├── components/NotificationBell.tsx
    ├── hooks/use-notifications.ts
    ├── services/notification.service.ts
    ├── types/notification.types.ts
    └── index.ts
```

#### Passo 6: Validar e Testar

```bash
/arch-validate
/pre-commit
```

**Resultado:**
```
✅ Arquitetura validada
✅ Todos os testes passando
✅ Lint sem erros
✅ Type-check OK
```

**Tempo total:** ~20 minutos (vs 3-4 horas manual)

---

## 🔄 Refatorando Código Legado

### Cenário: Refatorar Transaction Controller para Clean Architecture

#### Antes (Código Legado)
```typescript
// controllers/transaction.controller.ts - TUDO MISTURADO
@Controller('transactions')
export class TransactionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() data: any) {
    // Validação inline
    if (!data.amount) throw new Error('Amount required');

    // Lógica de negócio no controller
    const account = await this.prisma.account.findUnique({
      where: { id: data.accountId }
    });

    if (account.balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    // Persistência direta
    return this.prisma.transaction.create({ data });
  }
}
```

#### Refatoração com Claude

```
Você: Refatore este controller seguindo Clean Architecture

Claude: Vou refatorar seguindo os padrões do projeto:
1. Mover validações para DTOs
2. Mover lógica de negócio para domain/use cases
3. Mover persistência para repository
4. Controller apenas orquestra
```

#### Depois (Clean Architecture)

**1. DTO com validações:**
```typescript
// application/dtos/transactions/create-transaction.dto.ts
export class CreateTransactionDto {
  @IsUUID()
  @ApiProperty()
  accountId: string;

  @IsNumber()
  @Min(0.01)
  @ApiProperty()
  amount: number;

  @IsEnum(TransactionType)
  @ApiProperty()
  type: TransactionType;
}
```

**2. Lógica de negócio no domain:**
```typescript
// domain/entities/transaction.entity.ts
export class Transaction {
  canBeCreated(account: Account): boolean {
    if (this.type === 'EXPENSE' && account.balance < this.amount) {
      return false;
    }
    return true;
  }
}
```

**3. Use case:**
```typescript
// application/use-cases/transactions/create-transaction.use-case.ts
export class CreateTransactionUseCase {
  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    const account = await this.accountRepo.findById(dto.accountId);
    const transaction = Transaction.create(dto);

    if (!transaction.canBeCreated(account)) {
      throw new InsufficientBalanceError();
    }

    return this.transactionRepo.create(transaction);
  }
}
```

**4. Controller limpo:**
```typescript
// infrastructure/http/controllers/transaction.controller.ts
@Controller('transactions')
export class TransactionController {
  constructor(private createUseCase: CreateTransactionUseCase) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.createUseCase.execute(dto);
  }
}
```

---

## 🧪 Implementando Testes

### Cenário: Adicionar testes para CreateTransactionUseCase

```
Você: Crie testes completos para CreateTransactionUseCase

Claude: Vou criar testes unitários com mocks:
```

**Teste gerado:**
```typescript
// application/use-cases/transactions/__tests__/create-transaction.use-case.spec.ts
describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepo: jest.Mocked<TransactionRepository>;
  let accountRepo: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    transactionRepo = {
      create: jest.fn(),
      findById: jest.fn(),
    } as any;

    accountRepo = {
      findById: jest.fn(),
    } as any;

    useCase = new CreateTransactionUseCase(transactionRepo, accountRepo);
  });

  describe('Criação de despesa', () => {
    it('deve criar despesa quando saldo suficiente', async () => {
      const account = { id: '1', balance: 1000 };
      const dto = { accountId: '1', amount: 500, type: 'EXPENSE' };

      accountRepo.findById.mockResolvedValue(account);
      transactionRepo.create.mockResolvedValue(/* ... */);

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
      expect(transactionRepo.create).toHaveBeenCalled();
    });

    it('deve falhar quando saldo insuficiente', async () => {
      const account = { id: '1', balance: 100 };
      const dto = { accountId: '1', amount: 500, type: 'EXPENSE' };

      accountRepo.findById.mockResolvedValue(account);

      await expect(useCase.execute(dto)).rejects.toThrow(
        InsufficientBalanceError
      );
    });
  });

  describe('Criação de receita', () => {
    it('deve criar receita sem verificar saldo', async () => {
      const account = { id: '1', balance: 0 };
      const dto = { accountId: '1', amount: 500, type: 'INCOME' };

      accountRepo.findById.mockResolvedValue(account);
      transactionRepo.create.mockResolvedValue(/* ... */);

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
    });
  });

  describe('Validações', () => {
    it('deve falhar quando conta não existe', async () => {
      accountRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(/* dto */)).rejects.toThrow(
        AccountNotFoundError
      );
    });
  });
});
```

**Executar:**
```bash
cd backend && npm test create-transaction.use-case
```

---

## 👁️ Code Review

### Cenário: Revisar PR antes de merge

```bash
/review
```

**Output do Claude:**
```markdown
# Code Review - PR #123: Add Notifications Feature

## 📊 Resumo
- **Arquivos modificados:** 15
- **Linhas adicionadas:** +487
- **Linhas removidas:** -12
- **Cobertura de testes:** 89% ✅

## ✅ Pontos Positivos
1. Clean Architecture respeitada
2. Testes unitários completos
3. Documentação atualizada
4. Tipos bem definidos

## ⚠️ Sugestões de Melhoria

### 1. notification.service.ts (linha 45)
**Issue:** Erro não está sendo tratado adequadamente

```typescript
// ❌ Atual
async sendPushNotification(userId: string) {
  await firebase.send(userId);
}

// ✅ Sugerido
async sendPushNotification(userId: string) {
  try {
    await firebase.send(userId);
  } catch (error) {
    this.logger.error('Failed to send notification', error);
    throw new NotificationError('Failed to send push notification');
  }
}
```

### 2. NotificationList.tsx (linha 23)
**Issue:** Possível memory leak - useEffect sem cleanup

```typescript
// ❌ Atual
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 30000);
}, []);

// ✅ Sugerido
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 30000);

  return () => clearInterval(interval);
}, [refetch]);
```

### 3. Faltando Validação
**Arquivo:** notification.repository.ts

Adicione validação de user ownership:
```typescript
async findByUserId(userId: string) {
  // Garantir que usuário só vê suas próprias notificações
  return this.prisma.notification.findMany({
    where: {
      userId,
      // Adicionar soft delete se necessário
      deletedAt: null
    }
  });
}
```

## 📋 Checklist
- [x] Arquitetura validada
- [x] Testes passando
- [x] Lint OK
- [x] Types OK
- [ ] Tratamento de erros completo (2 issues)
- [ ] Memory leaks corrigidos (1 issue)
- [ ] Segurança validada (1 issue)

## 🎯 Próximos Passos
1. Corrigir os 3 issues apontados
2. Adicionar testes de integração E2E
3. Testar em staging antes de produção

## 📊 Métricas
- **Complexidade:** Baixa-Média ✅
- **Manutenibilidade:** Alta ✅
- **Performance:** OK ✅
- **Segurança:** Atenção ⚠️

**Aprovação:** ⏸️ **CHANGES REQUESTED**
```

---

## 🗄️ Database Migrations

### Cenário: Adicionar campo avatar ao User

```bash
/db-migrate add-user-avatar-field
```

**Claude:**
```
Validando schema atual...
✅ Schema válido

Adicionando campo ao schema:
```

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  avatar    String?  // ✨ NOVO
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```
Criando migration...
✅ Migration criada: 20251120_add_user_avatar_field.sql

Conteúdo da migration:
```

```sql
-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
```

```
Aplicando migration...
✅ Migration aplicada com sucesso

Gerando Prisma Client...
✅ Prisma Client atualizado

Próximos passos:
1. Atualizar DTOs para incluir avatar
2. Atualizar testes
3. Implementar upload de imagem (se necessário)
```

---

## 🐛 Troubleshooting

### Problema: Testes falhando após refatoração

```
Você: Os testes estão falhando depois que refatorei o TransactionController

Claude: Vou analisar os erros...

Erro encontrado: Mocks desatualizados

O problema é que você mudou a signature do método mas não atualizou os mocks.

❌ Mock antigo:
```typescript
transactionRepo.create.mockResolvedValue({
  id: '1',
  amount: 100
});
```

✅ Mock correto:
```typescript
transactionRepo.create.mockResolvedValue(
  new Transaction(
    '1',
    'account-id',
    100,
    TransactionType.INCOME,
    new Date(),
    new Date()
  )
);
```

**Ou melhor ainda, use factory:**
```typescript
// test/factories/transaction.factory.ts
export class TransactionFactory {
  static create(overrides?: Partial<Transaction>): Transaction {
    return new Transaction(
      overrides?.id ?? uuid(),
      overrides?.accountId ?? 'default-account',
      overrides?.amount ?? 100,
      overrides?.type ?? TransactionType.INCOME,
      overrides?.createdAt ?? new Date(),
      overrides?.updatedAt ?? new Date(),
    );
  }
}

// No teste:
transactionRepo.create.mockResolvedValue(
  TransactionFactory.create({ amount: 500 })
);
```

---

## 💡 Dicas Rápidas

### 1. Usar Templates Existentes
```
Você: Crie um repository para Category usando o template

Claude: [Lê patterns.md e cria usando template exato]
```

### 2. Explorar Codebase
```
Você: Como funciona o sistema de goals no projeto?

Claude: [Analisa codebase e explica:]
- ForecastGoalAchievementUseCase calcula...
- Usa média de surplus mensal...
- Retorna data estimada...
```

### 3. Gerar Documentação
```
Você: Gere documentação API para o TransactionController

Claude: [Cria Swagger docs automaticamente]
```

### 4. Comparar Abordagens
```
Você: Qual a melhor forma de implementar soft delete?

Claude: [Compara 3 abordagens:]
1. Campo deletedAt (mais comum)
2. Status enum (mais explícito)
3. Tabela separada (mais complexo)

Recomendação: deletedAt por ser padrão do Prisma
```

---

## 📚 Recursos Relacionados

- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Comandos rápidos
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Problemas comuns
- [EXAMPLE-WORKFLOW.md](EXAMPLE-WORKFLOW.md) - Workflow completo
- [patterns.md](patterns.md) - Templates de código

---

**Lembre-se:** Estes são exemplos reais. Adapte-os para suas necessidades específicas!
