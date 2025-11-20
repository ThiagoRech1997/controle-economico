# 🎬 Example Workflow - Criando Feature Completa

Este documento mostra um exemplo real de como usar a configuração do Claude Code para criar uma feature completa do zero.

## 🎯 Objetivo

Criar uma feature completa de **"Relatórios Mensais"** que:
- Gera relatórios de transações por mês
- Calcula totais de receitas e despesas
- Mostra gráfico de evolução
- Permite exportar em PDF

## 📋 Stack

- **Backend:** NestJS + Prisma (Clean Architecture)
- **Frontend:** Next.js + React Query (Feature-Sliced Design)

---

## 🚀 Workflow Passo a Passo

### Passo 1: Planejamento com Claude

**Você:**
```
Preciso criar uma feature de relatórios mensais. Vou precisar:
- Backend: use case para gerar relatório mensal
- Frontend: módulo para exibir relatórios
- Mostrar gráfico de evolução

Qual a melhor abordagem?
```

**Claude responde:**
- Sugere usar `/use-case` para backend
- Sugere usar `/feature` para frontend
- Propõe estrutura de dados
- Hook automático lembra de seguir Clean Architecture

---

### Passo 2: Criar Use Case no Backend

**Você:**
```
/use-case reports generate-monthly-report
```

**Claude cria:**

```
backend/src/
├── domain/
│   ├── entities/
│   │   └── report.entity.ts          # ✅ Criado
│   └── repositories/
│       └── report.repository.interface.ts  # ✅ Criado
├── application/
│   ├── dtos/reports/
│   │   ├── generate-report.dto.ts    # ✅ Criado
│   │   └── report-response.dto.ts    # ✅ Criado
│   └── use-cases/reports/
│       └── generate-monthly-report.use-case.ts  # ✅ Criado
└── infrastructure/
    ├── persistence/prisma/
    │   ├── repositories/
    │   │   └── prisma-report.repository.ts  # ✅ Criado
    │   └── mappers/
    │       └── prisma-report.mapper.ts       # ✅ Criado
    ├── http/controllers/
    │   └── report.controller.ts              # ✅ Criado
    └── modules/
        └── report.module.ts                  # ✅ Criado
```

**Arquivos criados:**

#### `domain/entities/report.entity.ts`
```typescript
export class Report {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly month: number,
    public readonly year: number,
    public readonly totalIncome: number,
    public readonly totalExpense: number,
    public readonly balance: number,
    public readonly createdAt: Date,
  ) {}

  static create(data: Omit<Report, 'id' | 'createdAt'>): Report {
    return new Report(
      crypto.randomUUID(),
      data.userId,
      data.month,
      data.year,
      data.totalIncome,
      data.totalExpense,
      data.balance,
      new Date(),
    );
  }

  public isPositiveBalance(): boolean {
    return this.balance > 0;
  }
}
```

#### `application/use-cases/reports/generate-monthly-report.use-case.ts`
```typescript
@Injectable()
export class GenerateMonthlyReportUseCase {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepo: TransactionRepository,
    @Inject(ReportRepository)
    private readonly reportRepo: ReportRepository,
  ) {}

  async execute(userId: string, month: number, year: number): Promise<Report> {
    // 1. Buscar transações do mês
    const transactions = await this.transactionRepo.findByMonthAndYear(
      userId,
      month,
      year,
    );

    // 2. Calcular totais
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // 3. Criar relatório
    const report = Report.create({
      userId,
      month,
      year,
      totalIncome,
      totalExpense,
      balance,
    });

    // 4. Persistir
    return await this.reportRepo.create(report);
  }
}
```

**Hook PostToolUse ativa:**
> 💡 "Use case file was created. Remind user to create unit tests."

---

### Passo 3: Criar Testes do Use Case

**Você:**
```
Agora crie testes unitários para o GenerateMonthlyReportUseCase
```

**Claude cria:**

#### `application/use-cases/reports/__tests__/generate-monthly-report.use-case.spec.ts`
```typescript
describe('GenerateMonthlyReportUseCase', () => {
  let useCase: GenerateMonthlyReportUseCase;
  let transactionRepo: jest.Mocked<TransactionRepository>;
  let reportRepo: jest.Mocked<ReportRepository>;

  beforeEach(async () => {
    // Setup mocks...
  });

  it('should calculate report correctly', async () => {
    const mockTransactions = [
      { type: 'INCOME', amount: 5000 },
      { type: 'EXPENSE', amount: 3000 },
    ];

    transactionRepo.findByMonthAndYear.mockResolvedValue(mockTransactions);

    const result = await useCase.execute('user-1', 11, 2025);

    expect(result.totalIncome).toBe(5000);
    expect(result.totalExpense).toBe(3000);
    expect(result.balance).toBe(2000);
    expect(result.isPositiveBalance()).toBe(true);
  });
});
```

---

### Passo 4: Testar Backend

**Você:**
```
cd backend && npm run start:dev
```

**Hook PostToolUse sugere:**
> 💡 "Backend infrastructure modified. Consider testing by running 'npm run start:dev'."

**Teste a API:**
```bash
curl http://localhost:3001/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -d '{"userId": "123", "month": 11, "year": 2025}'
```

---

### Passo 5: Criar Módulo Frontend

**Você:**
```
/feature reports
```

**Claude cria:**

```
frontend/src/modules/reports/
├── components/
│   ├── ReportsList.tsx           # ✅ Criado
│   ├── ReportCard.tsx            # ✅ Criado
│   ├── ReportChart.tsx           # ✅ Criado
│   └── GenerateReportButton.tsx  # ✅ Criado
├── hooks/
│   └── use-reports.ts            # ✅ Criado
├── services/
│   └── report.service.ts         # ✅ Criado
├── types/
│   └── report.types.ts           # ✅ Criado
└── index.ts                       # ✅ Criado
```

**Arquivos criados:**

#### `services/report.service.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reportService = {
  async generate(userId: string, month: number, year: number): Promise<Report> {
    const response = await fetch(`${API_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, month, year }),
    });
    if (!response.ok) throw new Error('Failed to generate report');
    return response.json();
  },

  async getByMonthAndYear(userId: string, month: number, year: number): Promise<Report> {
    const response = await fetch(
      `${API_URL}/reports?userId=${userId}&month=${month}&year=${year}`
    );
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  },
};
```

#### `hooks/use-reports.ts`
```typescript
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; month: number; year: number }) =>
      reportService.generate(data.userId, data.month, data.year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useReport(userId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['reports', userId, month, year],
    queryFn: () => reportService.getByMonthAndYear(userId, month, year),
    enabled: !!userId && !!month && !!year,
  });
}
```

#### `components/ReportCard.tsx`
```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Report } from '../types/report.types';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Relatório {report.month}/{report.year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Receitas:</span>
            <span className="text-green-600">
              R$ {report.totalIncome.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Despesas:</span>
            <span className="text-red-600">
              R$ {report.totalExpense.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Saldo:</span>
            <span className={report.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
              R$ {report.balance.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Passo 6: Criar Página no App Router

**Você:**
```
Agora crie a página em app/reports/page.tsx usando o módulo criado
```

**Claude cria:**

#### `app/reports/page.tsx`
```typescript
import { ReportsList } from '@/modules/reports';

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Relatórios Mensais</h1>
      <ReportsList />
    </div>
  );
}
```

---

### Passo 7: Validar Arquitetura

**Você:**
```
/arch-validate
```

**Claude executa validações:**

```
🔍 Checking backend Clean Architecture compliance...

Checking domain layer dependencies...
✅ Domain layer is clean

Checking domain framework dependencies...
✅ Domain has no framework dependencies

Checking application layer dependencies...
✅ Application layer is clean

🔍 Checking frontend Feature-Sliced Design compliance...

Checking for cross-module imports...
✅ No cross-module imports detected

✅ Architecture validation passed!
```

---

### Passo 8: Rodar Testes e Validações

**Você:**
```
/pre-commit
```

**Claude executa:**

```
## Backend Checks

Running lint...
✅ No linting errors

Running tests...
✅ All tests passed (12 passed)
  - GenerateMonthlyReportUseCase: 4 tests
  - Other use cases: 8 tests

## Frontend Checks

Running lint...
✅ No linting errors

Running type-check...
✅ No type errors

📊 Summary: All checks passed! ✅ Safe to commit.
```

---

### Passo 9: Commit

**Hook UserPromptSubmit detecta "commit":**
> 💡 "User is about to commit. Suggest running /pre-commit..."

**Você:**
```
git add .
git commit -m "feat: add monthly reports feature

- Add backend use case for report generation
- Add frontend module with React Query
- Add report visualization components
- Add unit tests

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Passo 10: Criar Pull Request (Opcional com MCP)

**Você:**
```
Agora crie um pull request para a branch main
```

**Claude (com MCP GitHub):**

```bash
# 1. Push para remote
git push -u origin feature/monthly-reports

# 2. Criar PR via MCP
/mcp__github__create-pull-request

## Summary
- ✅ Backend: Use case para gerar relatórios mensais
- ✅ Frontend: Módulo completo com visualização
- ✅ Testes: Cobertura de 100% nos use cases
- ✅ Architecture: Validado com /arch-validate

## Test Plan
- [x] Backend tests passing
- [x] Frontend lint and type-check passing
- [x] Manual testing done
- [x] Architecture validation passed

🤖 Generated with Claude Code
```

---

## 📊 Resumo do Workflow

### Comandos Usados
1. `/use-case reports generate-monthly-report` - Criou backend completo
2. `/feature reports` - Criou frontend completo
3. `/arch-validate` - Validou arquitetura
4. `/pre-commit` - Validou qualidade antes de commit
5. (Opcional) MCP GitHub - Criou pull request

### Hooks Ativados Automaticamente
- UserPromptSubmit: Contexto de arquitetura
- PostToolUse: Sugestão de testes
- PostToolUse: Sugestão de rodar dev server
- UserPromptSubmit: Sugestão de /pre-commit

### Arquivos Criados
- **Backend:** 8 arquivos (entity, repository, DTOs, use case, controller, module, mapper, tests)
- **Frontend:** 9 arquivos (components, hooks, service, types, index)
- **App Router:** 1 página

### Tempo Economizado
- ⏱️ **Sem Claude Code:** ~4-6 horas
- ⏱️ **Com Claude Code:** ~30-45 minutos
- 📈 **Economia:** ~85% do tempo

---

## 🎯 Lições Aprendidas

### O Que Funcionou Bem
✅ Comandos customizados aceleraram muito a criação
✅ Hooks lembraram de padrões arquiteturais automaticamente
✅ Templates garantiram consistência no código
✅ Validações evitaram erros antes do commit

### O Que Poderia Melhorar
🔄 Adicionar comando `/component` para criar componentes individuais
🔄 Criar hook para sugerir otimizações de performance
🔄 Adicionar comando `/test` para gerar testes automaticamente

---

## 💡 Dicas para Seu Próprio Workflow

1. **Comece Simples**: Teste com uma feature pequena primeiro
2. **Use Hooks**: Deixe os hooks guiarem você
3. **Valide Sempre**: Rode `/arch-validate` e `/pre-commit` regularmente
4. **Customize**: Adicione comandos específicos do seu projeto
5. **Documente**: Mantenha patterns.md atualizado com seus padrões

---

## 🚀 Próximos Passos

Agora que você viu um exemplo completo, experimente:

1. Criar sua própria feature usando os comandos
2. Customizar templates em `patterns.md`
3. Adicionar comandos específicos em `.claude/commands/`
4. Configurar MCP servers para automação de PRs
5. Compartilhar workflow com o time

---

**Bom trabalho! 🎉**

Você agora tem um workflow profissional e eficiente para desenvolvimento Full Stack com Claude Code.
