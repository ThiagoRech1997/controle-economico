# Claude Code - Guia de Uso

Este guia explica como usar todos os recursos customizados do Claude Code neste projeto.

## 📋 Índice

1. [Comandos Customizados](#comandos-customizados)
2. [Hooks Automáticos](#hooks-automáticos)
3. [Templates e Padrões](#templates-e-padrões)
4. [MCP Servers](#mcp-servers)
5. [Fluxos de Trabalho Comuns](#fluxos-de-trabalho-comuns)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Comandos Customizados

### `/use-case <feature> <use-case-name>`

Cria um novo use case completo seguindo Clean Architecture.

**Exemplo:**
```
/use-case payments create-payment
```

**O que ele cria:**
- Domain entity (se necessário)
- Repository interface
- DTOs (input/output)
- Use case implementation
- Prisma repository implementation
- Controller
- Module configuration

---

### `/feature <feature-name>`

Cria um módulo completo no frontend seguindo Feature-Sliced Design.

**Exemplo:**
```
/feature notifications
```

**O que ele cria:**
```
modules/notifications/
├── components/       # Componentes React
├── hooks/           # React Query hooks
├── services/        # API service
├── types/           # TypeScript types
└── index.ts         # Barrel export
```

---

### `/pre-commit`

Executa todas as validações antes de fazer commit.

**O que ele faz:**
- ✅ Roda lint no backend
- ✅ Roda testes no backend
- ✅ Roda lint no frontend
- ✅ Roda type-check no frontend
- 📊 Mostra resumo dos resultados

**Uso:**
```
/pre-commit
```

---

### `/db-migrate <migration-name>`

Helper para criar migrações do Prisma.

**Exemplo:**
```
/db-migrate add-user-avatar-field
```

**O que ele faz:**
1. Valida o schema atual
2. Mostra o schema.prisma
3. Cria a migração
4. Gera o Prisma Client
5. Mostra o arquivo SQL da migração

---

### `/arch-validate`

Valida se o código segue os padrões arquiteturais.

**O que ele verifica:**

**Backend (Clean Architecture):**
- ❌ Domain não importa de Infrastructure
- ❌ Domain não usa @nestjs
- ❌ Application não importa de Infrastructure

**Frontend (Feature-Sliced Design):**
- ❌ Módulos não fazem import entre si

**Uso:**
```
/arch-validate
```

---

## 🪝 Hooks Automáticos

Os hooks funcionam automaticamente em segundo plano. Você não precisa chamá-los explicitamente.

### UserPromptSubmit Hooks

Executam quando você envia uma mensagem.

#### 1. Contexto de Arquitetura (Backend)
**Ativa quando:** Você menciona `backend`, `nestjs`, `domain`, `application`, `infrastructure`, etc.

**O que faz:** Lembra o Claude de seguir Clean Architecture.

---

#### 2. Contexto de Frontend
**Ativa quando:** Você menciona `frontend`, `next.js`, `modules`, `feature`, `component`, etc.

**O que faz:** Lembra o Claude de seguir Feature-Sliced Design.

---

#### 3. Sugestão de Use Case
**Ativa quando:** Você escreve `create use case`, `new use case`, etc.

**O que faz:** Sugere usar `/use-case` ou guia pela estrutura Clean Architecture.

---

#### 4. Sugestão de Feature Module
**Ativa quando:** Você escreve `create feature`, `new module`, etc.

**O que faz:** Sugere usar `/feature` ou guia pela estrutura Feature-Sliced.

---

#### 5. Sugestão de Validação
**Ativa quando:** Você menciona `commit`, `git commit`, `ready to commit`, etc.

**O que faz:** Sugere executar `/pre-commit` antes de commitar.

---

### PreToolUse Hooks

Executam antes de ferramentas serem usadas.

#### 1. Proteção de .env
**Ativa quando:** Claude tenta escrever em arquivos `.env`

**O que faz:** Alerta sobre exposição de secrets e pede confirmação.

---

#### 2. Proteção de Arquivos Críticos
**Ativa quando:** Claude tenta deletar `schema.prisma`, `package.json`, etc.

**O que faz:** Bloqueia ou pede confirmação para arquivos críticos.

---

#### 3. Validação de Migrações
**Ativa quando:** Claude executa `prisma migrate`

**O que faz:** Lembra de validar schema, usar nome descritivo, fazer backup.

---

### PostToolUse Hooks

Executam após ferramentas serem usadas.

#### 1. Validação de Schema Prisma
**Ativa quando:** Arquivo `schema.prisma` é modificado

**O que faz:** Sugere rodar `prisma validate`, `prisma format`, e criar migração.

---

#### 2. Sugestão de Testes
**Ativa quando:** Arquivo use-case é criado/modificado

**O que faz:** Lembra de criar testes unitários e de integração.

---

#### 3. Teste de Runtime
**Ativa quando:** Arquivos de infraestrutura são modificados (module, controller, service)

**O que faz:** Sugere rodar `npm run start:dev` para verificar erros de runtime.

---

## 📝 Templates e Padrões

Todos os templates estão em [`.claude/patterns.md`](.claude/patterns.md).

### Backend Templates

1. **Domain Entity** - Entidade pura de negócio
2. **Repository Interface** - Porta (interface) para persistência
3. **Application DTO** - Objetos de transferência
4. **Use Case** - Caso de uso/serviço de aplicação
5. **Prisma Repository** - Adaptador de persistência
6. **Prisma Mapper** - Conversão Prisma ↔ Domain
7. **Controller** - Controlador REST
8. **Module** - Módulo NestJS com DI

### Frontend Templates

1. **TypeScript Types** - Interfaces do módulo
2. **API Service** - Chamadas HTTP
3. **React Query Hooks** - Hooks de dados
4. **Component** - Componente React
5. **Module Index** - Barrel export

### Testes

1. **Backend Unit Test** - Teste unitário de use case
2. **Frontend Component Test** - Teste de componente React

---

## 🔌 MCP Servers

### Configuração

O arquivo `.mcp.json` está configurado com:

1. **GitHub MCP** - Integração com GitHub
2. **Filesystem MCP** - Operações de arquivo avançadas

### Como Habilitar

1. **Instale os servidores MCP:**
```bash
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-filesystem
```

2. **Configure seu GitHub token:**
   - Edite `.mcp.json`
   - Substitua `your-github-token-here` por seu token real
   - Obtenha um token em: https://github.com/settings/tokens

3. **Reinicie o Claude Code**

### Comandos MCP Disponíveis

Uma vez configurado, você pode usar:

```bash
# Listar PRs
/mcp__github__list-pull-requests

# Ver detalhes de PR
/mcp__github__get-pull-request <number>

# Criar issue
/mcp__github__create-issue

# Operações de arquivo avançadas
/mcp__filesystem__read-file
/mcp__filesystem__write-file
```

---

## 🔄 Fluxos de Trabalho Comuns

### 1. Criar Nova Feature Completa (Backend + Frontend)

```bash
# 1. Criar use case no backend
/use-case orders create-order

# 2. Testar backend
cd backend && npm run start:dev

# 3. Criar módulo frontend
/feature orders

# 4. Testar frontend
cd frontend && npm run dev

# 5. Validar arquitetura
/arch-validate

# 6. Rodar testes
/pre-commit

# 7. Commitar
git add .
git commit -m "feat: add orders feature"
```

---

### 2. Modificar Schema do Banco

```bash
# 1. Editar schema.prisma manualmente
# (Claude pode ajudar)

# 2. Criar migração
/db-migrate add-new-field

# 3. Verificar migração gerada
# (Claude mostra o SQL)

# 4. Testar backend
cd backend && npm run start:dev
```

---

### 3. Code Review de PR

```bash
# 1. Verificar estrutura
/arch-validate

# 2. Rodar validações
/pre-commit

# 3. Review manual
# (Claude pode fazer review detalhado)
```

---

### 4. Adicionar Novo Caso de Uso a Feature Existente

```bash
# Se você já tem uma feature "transactions"
# e quer adicionar "update-transaction":

/use-case transactions update-transaction

# O Claude vai:
# 1. Detectar que a feature já existe
# 2. Reusar entity e repository existentes
# 3. Criar apenas DTO, use case e controller novos
# 4. Atualizar o module existente
```

---

## 🔍 Troubleshooting

### Hooks não estão funcionando

**Problema:** Os hooks não parecem estar executando.

**Solução:**
1. Verifique se `.claude/hooks.json` existe
2. Verifique a sintaxe JSON (use um validator)
3. Verifique se o matcher está correto (é regex)
4. Reinicie o Claude Code

---

### Scripts de hook retornam erro

**Problema:** Scripts em `scripts/hooks/` retornam erro de permissão.

**Solução (Linux/Mac):**
```bash
chmod +x scripts/hooks/*.sh
```

**Solução (Windows):**
- Use Git Bash ou WSL
- Ou converta scripts para `.ps1` (PowerShell)

---

### MCP servers não funcionam

**Problema:** Comandos MCP não aparecem ou falham.

**Solução:**
1. Verifique se instalou os pacotes:
   ```bash
   npm list -g @modelcontextprotocol/server-github
   ```
2. Verifique o `.mcp.json`:
   - Token do GitHub está correto?
   - Path está correto? (Use barras duplas no Windows: `C:\\Users\\...`)
3. Veja logs do Claude Code

---

### Comandos customizados não aparecem

**Problema:** `/use-case` e outros não funcionam.

**Solução:**
1. Verifique se `.claude/commands/*.md` existem
2. Verifique o frontmatter YAML (linhas `---`)
3. Digite `/help` para ver comandos disponíveis
4. Reinicie o Claude Code

---

### Validação de arquitetura falha incorretamente

**Problema:** `/arch-validate` reporta falsos positivos.

**Solução:**
1. Verifique se você está usando path aliases corretamente
2. Use `@/` para imports internos
3. Ajuste o script em `scripts/hooks/validate-architecture.sh`

---

## 📚 Recursos Adicionais

- **CLAUDE.md** - Visão geral do projeto e arquitetura
- **patterns.md** - Templates e padrões de código
- **Backend README** - `backend/README.md`
- **Frontend README** - `frontend/README.md`

---

## 🎓 Aprendendo mais sobre Claude Code

```bash
# Ajuda geral
/help

# Documentação oficial
https://code.claude.com/docs

# GitHub do projeto
https://github.com/anthropics/claude-code
```

---

## 💡 Dicas Profissionais

### 1. Combine comandos em uma conversa
```
Vou criar uma nova feature de relatórios:
1. /use-case reports generate-monthly-report
2. /feature reports
3. /arch-validate
```

### 2. Use o contexto do CLAUDE.md
O Claude sempre tem acesso ao `CLAUDE.md`, então você pode dizer:
```
"Crie um use case seguindo o padrão do CLAUDE.md"
```

### 3. Refira-se aos patterns
```
"Use o template de Prisma Repository do patterns.md"
```

### 4. Aproveite os hooks
Simplesmente mencione o que quer fazer naturalmente:
```
"Quero criar um novo use case de pagamento"
// Hook detecta e sugere o comando apropriado
```

### 5. Valide antes de commitar
Sempre rode:
```
/pre-commit
```

---

## 🚀 Próximos Passos

1. **Experimente os comandos** - Teste cada um para entender o que fazem
2. **Customize os hooks** - Ajuste `.claude/hooks.json` às suas necessidades
3. **Adicione mais templates** - Expanda `.claude/patterns.md` com padrões específicos
4. **Configure MCP** - Habilite integrações avançadas
5. **Compartilhe com o time** - Commite `.claude/` no repositório

---

**Lembre-se:** O Claude Code aprende com seus padrões. Quanto mais você usar os comandos e seguir a arquitetura, melhor ele fica em ajudá-lo!
