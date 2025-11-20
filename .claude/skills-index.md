# Skills & Agents Index - Visual Guide

Guia visual de todos os skills e agents disponíveis neste projeto.

## 🎯 Quick Navigation

| Type | Count | Status |
|------|-------|--------|
| **Commands** | 5 | ✅ Ready |
| **Skills** | 5 | 🚧 Planned |
| **Agents** | 5 | 🚧 Planned |
| **Workflows** | 5 | 🚧 Planned |

---

## 📦 Commands (Ready to Use)

Commands são ações diretas com argumentos. Use: `/command-name`

```
┌─────────────────────────────────────────────────────────────┐
│                        🎯 COMMANDS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /use-case <feature> <name>                                 │
│  ├─ Cria use case completo (backend)                        │
│  ├─ Domain + Application + Infrastructure                   │
│  └─ ⏱️  ~2 min                                              │
│                                                              │
│  /feature <name>                                            │
│  ├─ Cria módulo completo (frontend)                         │
│  ├─ Components + Hooks + Services + Types                   │
│  └─ ⏱️  ~1 min                                              │
│                                                              │
│  /arch-validate                                             │
│  ├─ Valida Clean Architecture + Feature-Sliced              │
│  ├─ Detecta violações de camadas                            │
│  └─ ⏱️  ~30 seg                                             │
│                                                              │
│  /pre-commit                                                │
│  ├─ Lint + Tests + Type-check                               │
│  ├─ Backend + Frontend                                       │
│  └─ ⏱️  ~2 min                                              │
│                                                              │
│  /db-migrate <name>                                         │
│  ├─ Helper de migrations Prisma                             │
│  ├─ Valida + Cria + Aplica                                  │
│  └─ ⏱️  ~1 min                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Skills (Planned)

Skills são workflows guiados interativos. Fazem perguntas e guiam passo a passo.

```
┌─────────────────────────────────────────────────────────────┐
│                        🎨 SKILLS                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🏗️  create-use-case                                        │
│  ├─ Workflow interativo para criar use case                 │
│  ├─ Pergunta: feature, nome, validações, etc.               │
│  └─ ⏱️  ~5 min (interativo)                                 │
│                                                              │
│  🎨 create-feature-module                                   │
│  ├─ Workflow interativo para módulo frontend                │
│  ├─ Pergunta: nome, tipo de componente, etc.                │
│  └─ ⏱️  ~3 min (interativo)                                 │
│                                                              │
│  ✅ validate-architecture                                   │
│  ├─ Validação guiada com explicações                        │
│  ├─ Sugere correções para violações                         │
│  └─ ⏱️  ~2 min                                              │
│                                                              │
│  🧪 pre-commit-check                                        │
│  ├─ Validações com feedback interativo                      │
│  ├─ Permite corrigir e retentar                             │
│  └─ ⏱️  ~3 min                                              │
│                                                              │
│  🗄️  database-migration                                     │
│  ├─ Guia criação de migration segura                        │
│  ├─ Valida impacto e gera rollback                          │
│  └─ ⏱️  ~5 min                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agents (Planned)

Agents são workers autônomos. Executam tarefas complexas independentemente.

```
┌─────────────────────────────────────────────────────────────┐
│                        🤖 AGENTS                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👁️  code-reviewer                                          │
│  ├─ Autonomia: ████████░░ 80%                               │
│  ├─ Revisa código automaticamente                           │
│  ├─ Verifica arquitetura, qualidade, segurança              │
│  ├─ Gera relatório detalhado                                │
│  └─ ⏱️  ~3-5 min                                            │
│                                                              │
│  🧪 test-generator                                          │
│  ├─ Autonomia: ██████████ 100%                              │
│  ├─ Gera testes automaticamente                             │
│  ├─ Unit + Integration + E2E                                │
│  ├─ Cria mocks e fixtures                                   │
│  └─ ⏱️  ~2-4 min                                            │
│                                                              │
│  🏗️  architecture-validator                                 │
│  ├─ Autonomia: ████████░░ 80%                               │
│  ├─ Scanneia codebase completo                              │
│  ├─ Identifica todas as violações                           │
│  ├─ Sugere refatorações                                     │
│  └─ ⏱️  ~5-10 min                                           │
│                                                              │
│  🗄️  migration-assistant                                    │
│  ├─ Autonomia: ████████░░ 80%                               │
│  ├─ Analisa schema e dependências                           │
│  ├─ Gera migration + rollback                               │
│  ├─ Valida integridade                                      │
│  └─ ⏱️  ~3-5 min                                            │
│                                                              │
│  ⚡ performance-optimizer                                   │
│  ├─ Autonomia: ██████░░░░ 60%                               │
│  ├─ Identifica gargalos                                     │
│  ├─ Sugere otimizações                                      │
│  ├─ N+1, bundle size, etc.                                  │
│  └─ ⏱️  ~5-8 min                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflows (Planned)

Workflows orquestram commands, skills e agents para processos end-to-end.

```
┌─────────────────────────────────────────────────────────────┐
│                       🔄 WORKFLOWS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🚀 full-feature-workflow                                   │
│  ├─ Etapas: 8 (Planning → Deploy)                           │
│  ├─ Cria feature completa do zero                           │
│  ├─ Backend + Frontend + Tests + Docs                       │
│  └─ ⏱️  ~15-30 min                                          │
│                                                              │
│  🗄️  database-change-workflow                               │
│  ├─ Etapas: 7 (Backup → Rollback Plan)                      │
│  ├─ Mudança de banco segura                                 │
│  ├─ Backup + Migration + Validation                         │
│  └─ ⏱️  ~5-10 min                                           │
│                                                              │
│  ♻️  refactoring-workflow                                   │
│  ├─ Etapas: 7 (Analysis → Documentation)                    │
│  ├─ Refatoração segura com testes                           │
│  ├─ Mantém funcionalidade                                   │
│  └─ ⏱️  ~10-20 min                                          │
│                                                              │
│  📋 pr-preparation-workflow                                 │
│  ├─ Etapas: 7 (Validation → PR Creation)                    │
│  ├─ Prepara PR completo                                     │
│  ├─ Tests + Docs + Review + Template                        │
│  └─ ⏱️  ~5-10 min                                           │
│                                                              │
│  🎓 onboarding-workflow                                     │
│  ├─ Etapas: 6 (Tour → First Task)                           │
│  ├─ Auxilia novos desenvolvedores                           │
│  ├─ Explica arquitetura + cria exemplo                      │
│  └─ ⏱️  ~20-30 min                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quando Usar Cada Um?

### Use Commands quando:
- ✅ Você sabe exatamente o que quer
- ✅ Ação é direta e rápida
- ✅ Poucos parâmetros necessários

**Exemplo:** `/use-case payments create-payment`

---

### Use Skills quando:
- 🤔 Você precisa de orientação
- ❓ Tem dúvidas sobre como proceder
- 🎯 Quer processo passo a passo

**Exemplo:** Skill interativo pergunta nome, tipo, etc.

---

### Use Agents quando:
- 🤖 Tarefa é complexa e demorada
- 💤 Você quer delegar totalmente
- 🧠 Requer decisões inteligentes

**Exemplo:** Agent faz code review completo automaticamente

---

### Use Workflows quando:
- 🔄 Precisa de processo end-to-end
- 🎭 Orquestra múltiplas ações
- 🎯 Objetivo final bem definido

**Exemplo:** Workflow cria feature inteira do planning ao deploy

---

## 📊 Comparison Matrix

| Feature | Commands | Skills | Agents | Workflows |
|---------|----------|--------|--------|-----------|
| **Autonomia** | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Velocidade** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡ |
| **Complexidade** | Baixa | Média | Alta | Muito Alta |
| **Interação** | Mínima | Média | Mínima | Média |
| **Uso típico** | 50x/dia | 5x/dia | 2x/dia | 1x/dia |

---

## 🗺️ Decision Tree

```
Preciso criar código?
│
├─ Sim, rápido e direto
│  └─ Use COMMAND (/use-case, /feature)
│
├─ Sim, mas não sei bem como
│  └─ Use SKILL (cria-use-case interativo)
│
├─ Preciso analisar/revisar código
│  └─ Use AGENT (code-reviewer)
│
└─ Preciso fazer processo completo
   └─ Use WORKFLOW (full-feature-workflow)
```

---

## 📚 Documentação Relacionada

- [Commands](./commands/) - Códigos dos comandos
- [Skills README](./skills/README.md) - Documentação de skills
- [Agents README](./agents/README.md) - Documentação de agents
- [Workflows README](./workflows/README.md) - Documentação de workflows
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Referência rápida
- [EXAMPLES.md](./EXAMPLES.md) - Exemplos práticos

---

## 💡 Pro Tips

1. **Comece com Commands** - São os mais rápidos e diretos
2. **Use `/pre-commit` sempre** - Antes de todo commit
3. **Valide arquitetura frequentemente** - `/arch-validate`
4. **Skills para aprender** - Use skills quando estiver aprendendo
5. **Agents para tarefas longas** - Delegue e faça outra coisa
6. **Workflows para features** - Process end-to-end completo

---

**Bookmark this page!** Use como referência visual rápida. 🔖
