# Skills - Prompt Templates for Guided Workflows

Skills são templates de prompts que guiam workflows específicos. Eles são invocados com `/skill <skill-name>` ou através de hooks automáticos.

## 📋 Skills Disponíveis

### 1. create-use-case
Guia a criação de um use case completo seguindo Clean Architecture.

**Uso:** `/skill create-use-case`

**O que faz:**
1. Pergunta o nome da feature e do use case
2. Cria domain entity (se necessário)
3. Cria repository interface
4. Cria DTOs
5. Cria use case implementation
6. Cria Prisma repository
7. Cria controller
8. Configura module

---

### 2. create-feature-module
Guia a criação de um módulo frontend completo com Feature-Sliced Design.

**Uso:** `/skill create-feature-module`

**O que faz:**
1. Pergunta o nome da feature
2. Cria estrutura de pastas
3. Cria types
4. Cria service
5. Cria React Query hooks
6. Cria componentes base
7. Cria barrel export

---

### 3. validate-architecture
Valida que o código segue os padrões arquiteturais do projeto.

**Uso:** `/skill validate-architecture`

**O que faz:**
1. Verifica dependências do domain layer
2. Verifica dependências do application layer
3. Verifica cross-module imports no frontend
4. Gera relatório de violações

---

### 4. pre-commit-check
Executa todas as validações antes de um commit.

**Uso:** `/skill pre-commit-check`

**O que faz:**
1. Roda lint no backend
2. Roda testes no backend
3. Roda lint no frontend
4. Roda type-check no frontend
5. Mostra resumo consolidado

---

### 5. database-migration
Auxilia na criação de migrations do Prisma.

**Uso:** `/skill database-migration`

**O que faz:**
1. Mostra schema atual
2. Valida schema
3. Pergunta nome da migration
4. Cria migration
5. Gera Prisma client
6. Mostra SQL gerado

---

## 🎯 Como Criar um Novo Skill

1. Crie um arquivo `.claude/skills/<skill-name>.md`
2. Defina o frontmatter com metadados
3. Escreva o prompt template
4. Documente neste README

### Template de Skill

```markdown
---
skill: skill-name
description: Brief description of what this skill does
category: backend|frontend|database|validation
tags: [tag1, tag2]
---

# Skill: <Name>

## Objetivo
<Clear description of what this skill accomplishes>

## Inputs
- Input 1: <description>
- Input 2: <description>

## Outputs
- Output 1: <description>
- Output 2: <description>

## Prompt Template

<Your guided workflow prompt here>

## Exemplo de Uso

<Example of how to use this skill>
```

---

## 📚 Skills vs Comandos vs Agents

| Tipo | Quando Usar | Exemplo |
|------|-------------|---------|
| **Skills** | Workflows guiados interativos | Criar use case com perguntas |
| **Comandos** | Ações diretas com argumentos | `/use-case payments create` |
| **Agents** | Tarefas autônomas complexas | Code review automático |

---

## 🔄 Integração com Hooks

Skills podem ser invocados automaticamente via hooks:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "create.*use case",
        "hooks": [
          {
            "type": "skill",
            "skill": "create-use-case"
          }
        ]
      }
    ]
  }
}
```

---

## 📊 Estatísticas

- **Skills disponíveis:** 5
- **Categorias:** Backend (2), Frontend (1), Database (1), Validation (1)
- **Skills planejados:** 3+ (ver Roadmap)

---

## 🗺️ Roadmap

### Próximos Skills
- [ ] `generate-tests` - Gera testes automaticamente
- [ ] `optimize-component` - Otimiza componentes React
- [ ] `refactor-code` - Guia refatoração segura
- [ ] `create-endpoint` - Cria endpoint REST completo
- [ ] `setup-auth` - Configura autenticação

---

**Nota:** Skills estão em desenvolvimento. Use os comandos em `.claude/commands/` enquanto isso.
