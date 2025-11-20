# Agents - Autonomous AI Workers

Agents são workers autônomos que executam tarefas complexas de forma independente, sem interação humana constante.

## 🤖 Agents Disponíveis

### 1. code-reviewer
Revisa código automaticamente verificando padrões arquiteturais, qualidade e boas práticas.

**Uso:** `Task tool` com `subagent_type: "code-reviewer"`

**O que faz:**
- Verifica Clean Architecture no backend
- Verifica Feature-Sliced Design no frontend
- Analisa complexidade de código
- Identifica code smells
- Sugere melhorias
- Verifica cobertura de testes

---

### 2. test-generator
Gera testes automaticamente para código existente.

**Uso:** `Task tool` com `subagent_type: "test-generator"`

**O que faz:**
- Analisa use cases e gera testes unitários
- Analisa componentes e gera testes de componente
- Cria mocks apropriados
- Garante cobertura de edge cases
- Segue padrões de teste do projeto

---

### 3. architecture-validator
Valida continuamente que o código segue os padrões arquiteturais.

**Uso:** `Task tool` com `subagent_type: "architecture-validator"`

**O que faz:**
- Scanneia codebase inteiro
- Identifica violações arquiteturais
- Gera relatório detalhado
- Sugere correções
- Pode rodar em CI/CD

---

### 4. migration-assistant
Auxilia em migrations complexas do banco de dados.

**Uso:** `Task tool` com `subagent_type: "migration-assistant"`

**O que faz:**
- Analisa schema atual
- Identifica dependências
- Gera migration segura
- Cria scripts de rollback
- Valida integridade referencial

---

### 5. performance-optimizer
Analisa e otimiza performance do código.

**Uso:** `Task tool` com `subagent_type: "performance-optimizer"`

**O que faz:**
- Identifica gargalos
- Sugere otimizações de queries
- Identifica N+1 problems
- Analisa bundle size (frontend)
- Sugere memoization e caching

---

## 🎯 Como Usar Agents

### Via Task Tool

```typescript
// No Claude Code, use:
Task tool com:
{
  "subagent_type": "code-reviewer",
  "prompt": "Review the changes in the payments module",
  "description": "Code review for payments"
}
```

### Via Hooks (Automático)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "git.*commit",
        "hooks": [
          {
            "type": "agent",
            "agent": "code-reviewer",
            "prompt": "Review changes before commit"
          }
        ]
      }
    ]
  }
}
```

---

## 📋 Agent Configuration

Agents podem ser configurados em `.claude/settings.local.json`:

```json
{
  "agents": {
    "code-reviewer": {
      "enabled": true,
      "autoRun": false,
      "config": {
        "strictness": "high",
        "checkTests": true,
        "checkDocs": true
      }
    },
    "test-generator": {
      "enabled": true,
      "autoRun": false,
      "config": {
        "coverageThreshold": 80,
        "generateMocks": true
      }
    }
  }
}
```

---

## 🔄 Agents vs Skills vs Commands

| Aspecto | Agents | Skills | Commands |
|---------|--------|--------|----------|
| **Autonomia** | Totalmente autônomo | Guiado/Interativo | Direto |
| **Complexidade** | Alta | Média | Baixa |
| **Interação** | Mínima | Perguntas/respostas | Argumentos |
| **Exemplo** | Code review completo | Criar use case | `/pre-commit` |
| **Duração** | Minutos | Segundos/minutos | Segundos |

---

## 🏗️ Como Criar um Novo Agent

### 1. Defina o Agent

Crie `.claude/agents/<agent-name>.md`:

```markdown
---
agent: agent-name
description: What this agent does
autonomy: high|medium|low
tools: [bash, read, write, grep, glob]
---

# Agent: <Name>

## Objetivo
<Clear autonomous task description>

## Capabilities
- Capability 1
- Capability 2

## Execution Flow
1. Step 1
2. Step 2
3. Step 3

## Success Criteria
- Criteria 1
- Criteria 2

## Error Handling
- Error case 1: action
- Error case 2: action
```

### 2. Configure em hooks.json (se aplicável)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "write.*\\.use-case\\.ts",
        "hooks": [
          {
            "type": "agent",
            "agent": "test-generator",
            "prompt": "Generate tests for the new use case"
          }
        ]
      }
    ]
  }
}
```

### 3. Documente neste README

---

## 🎓 Best Practices

### 1. Keep Agents Focused
Agents devem ter um objetivo claro e específico.

❌ **Ruim:** `general-helper` (muito genérico)
✅ **Bom:** `test-generator` (objetivo específico)

### 2. Define Clear Success Criteria
O agent precisa saber quando terminou.

```markdown
## Success Criteria
- All use cases have corresponding tests
- Test coverage is > 80%
- All tests pass
```

### 3. Handle Errors Gracefully
Agents devem ter estratégias de fallback.

```markdown
## Error Handling
- If file doesn't exist: create it
- If tests fail: report and don't commit
- If timeout: save progress and notify
```

### 4. Log Progress
Agents devem comunicar o que estão fazendo.

```markdown
## Progress Reporting
- "Analyzing use case..."
- "Generating test cases..."
- "Running tests..."
- "✅ Tests generated successfully"
```

---

## 🚀 Roadmap

### Em Desenvolvimento
- [ ] `code-reviewer` - Review automático
- [ ] `test-generator` - Geração de testes
- [ ] `architecture-validator` - Validação contínua

### Planejados
- [ ] `dependency-updater` - Atualiza deps automaticamente
- [ ] `security-scanner` - Scanneia vulnerabilidades
- [ ] `documentation-generator` - Gera docs a partir do código
- [ ] `refactoring-assistant` - Refatora código com segurança
- [ ] `ci-cd-optimizer` - Otimiza pipelines

---

## 📊 Estatísticas

- **Agents disponíveis:** 5 (em desenvolvimento)
- **Agents planejados:** 5+
- **Autonomia média:** Alta
- **Tempo médio de execução:** 2-5 minutos

---

## 🔗 Integração com CI/CD

Agents podem ser executados em pipelines:

```yaml
# .github/workflows/pr-review.yml
name: Agent Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Code Reviewer Agent
        run: |
          claude-agent run code-reviewer \
            --target "changed-files" \
            --report "pr-comment"
```

---

**Nota:** Agents estão em fase de planejamento. A implementação completa virá em versões futuras do projeto.
