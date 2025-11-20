# ✅ Installation Checklist

Use esta checklist para validar que tudo foi instalado corretamente.

## 📋 Verificação de Arquivos

### Arquivos de Configuração Principal

- [x] `.claude/README.md` - Overview da configuração
- [x] `.claude/USAGE-GUIDE.md` - Guia completo de uso
- [x] `.claude/SETUP-SUMMARY.md` - Resumo do setup
- [x] `.claude/INSTALLATION-CHECKLIST.md` - Este arquivo
- [x] `.claude/hooks.json` - Configuração de hooks
- [x] `.claude/patterns.md` - Templates de código
- [x] `.mcp.json` - Configuração MCP Servers

### Comandos Customizados

- [x] `.claude/commands/use-case.md`
- [x] `.claude/commands/feature.md`
- [x] `.claude/commands/pre-commit.md`
- [x] `.claude/commands/db-migrate.md`
- [x] `.claude/commands/arch-validate.md`

### Scripts de Automação

- [x] `scripts/hooks/validate-architecture.sh`
- [x] `scripts/hooks/format-typescript.sh`
- [x] `scripts/hooks/validate-file-deletion.sh`

## 🧪 Testes Funcionais

### 1. Testar Comandos Customizados

Execute cada comando para verificar se funciona:

#### Teste 1: /use-case
```
/use-case test create-test-entity
```

**Resultado esperado:**
- ✅ Claude cria estrutura completa de use case
- ✅ Arquivos criados em domain/, application/, infrastructure/
- ✅ Segue padrão Clean Architecture

**Status:** [ ] Passou  [ ] Falhou

---

#### Teste 2: /feature
```
/feature test-feature
```

**Resultado esperado:**
- ✅ Claude cria módulo frontend completo
- ✅ Estrutura: components/, hooks/, services/, types/
- ✅ Segue Feature-Sliced Design

**Status:** [ ] Passou  [ ] Falhou

---

#### Teste 3: /pre-commit
```
/pre-commit
```

**Resultado esperado:**
- ✅ Roda lint no backend
- ✅ Roda testes no backend
- ✅ Roda lint no frontend
- ✅ Roda type-check no frontend
- ✅ Mostra resumo dos resultados

**Status:** [ ] Passou  [ ] Falhou

---

#### Teste 4: /db-migrate
```
/db-migrate test-migration
```

**Resultado esperado:**
- ✅ Valida schema.prisma
- ✅ Mostra schema atual
- ✅ Cria migração
- ✅ Gera Prisma client

**Status:** [ ] Passou  [ ] Falhou

---

#### Teste 5: /arch-validate
```
/arch-validate
```

**Resultado esperado:**
- ✅ Verifica domain não importa infrastructure
- ✅ Verifica application não importa infrastructure
- ✅ Verifica cross-module imports no frontend
- ✅ Mostra relatório de violações

**Status:** [ ] Passou  [ ] Falhou

---

### 2. Testar Hooks Automáticos

#### Hook 1: Contexto de Backend
Digite:
```
Quero trabalhar no backend criando um novo controller
```

**Resultado esperado:**
- ✅ Claude menciona Clean Architecture
- ✅ Sugere padrões do CLAUDE.md

**Status:** [ ] Passou  [ ] Falhou

---

#### Hook 2: Contexto de Frontend
Digite:
```
Preciso criar um novo componente no frontend
```

**Resultado esperado:**
- ✅ Claude menciona Feature-Sliced Design
- ✅ Sugere estrutura de módulos

**Status:** [ ] Passou  [ ] Falhou

---

#### Hook 3: Sugestão de Use Case
Digite:
```
Preciso criar um novo use case de pagamento
```

**Resultado esperado:**
- ✅ Claude sugere usar `/use-case`
- ✅ Ou oferece guiar pela estrutura

**Status:** [ ] Passou  [ ] Falhou

---

#### Hook 4: Sugestão de Feature
Digite:
```
Vou adicionar uma nova feature de notificações
```

**Resultado esperado:**
- ✅ Claude sugere usar `/feature`
- ✅ Ou oferece criar a estrutura

**Status:** [ ] Passou  [ ] Falhou

---

#### Hook 5: Sugestão de Pre-commit
Digite:
```
Vou fazer commit das mudanças
```

**Resultado esperado:**
- ✅ Claude sugere rodar `/pre-commit`
- ✅ Lembra de validar antes de commitar

**Status:** [ ] Passou  [ ] Falhou

---

#### Hook 6: Proteção de .env
Peça ao Claude:
```
Escreva um valor no arquivo .env
```

**Resultado esperado:**
- ⚠️ Claude alerta sobre exposição de secrets
- ⚠️ Pede confirmação ou sugere usar valores mascarados

**Status:** [ ] Passou  [ ] Falhou

---

#### Hook 7: Validação de Prisma Schema
Modifique `schema.prisma` e veja se Claude:

**Resultado esperado:**
- ✅ Sugere rodar `prisma validate`
- ✅ Sugere rodar `prisma format`
- ✅ Sugere criar migração com `/db-migrate`

**Status:** [ ] Passou  [ ] Falhou

---

### 3. Testar Templates

#### Template 1: Domain Entity
Peça:
```
Crie uma domain entity User seguindo o template do patterns.md
```

**Resultado esperado:**
- ✅ Usa template correto
- ✅ Código puro (sem framework)
- ✅ Inclui factory method

**Status:** [ ] Passou  [ ] Falhou

---

#### Template 2: Repository Interface
Peça:
```
Crie uma repository interface para User
```

**Resultado esperado:**
- ✅ Interface em domain/repositories/
- ✅ Usa Symbol para DI
- ✅ Métodos CRUD padrão

**Status:** [ ] Passou  [ ] Falhou

---

#### Template 3: React Query Hook
Peça:
```
Crie hooks React Query para a feature users
```

**Resultado esperado:**
- ✅ useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser
- ✅ Query invalidation correto
- ✅ TypeScript types corretos

**Status:** [ ] Passou  [ ] Falhou

---

### 4. Testar Scripts de Automação

#### Script 1: validate-architecture.sh
```bash
bash scripts/hooks/validate-architecture.sh
```

**Resultado esperado:**
- ✅ Verifica domain layer
- ✅ Verifica application layer
- ✅ Verifica frontend modules
- ✅ Exit code 0 se OK, 1 se violações

**Status:** [ ] Passou  [ ] Falhou

---

#### Script 2: format-typescript.sh
Crie um arquivo TS mal formatado e rode:
```bash
echo '{"outputPath": "caminho/arquivo.ts"}' | bash scripts/hooks/format-typescript.sh
```

**Resultado esperado:**
- ✅ Arquivo é formatado com Prettier
- ✅ ESLint fix é aplicado (backend)

**Status:** [ ] Passou  [ ] Falhou

---

#### Script 3: validate-file-deletion.sh
```bash
echo '{"command": "rm .env"}' | bash scripts/hooks/validate-file-deletion.sh
```

**Resultado esperado:**
- ❌ Bloqueia (exit code 2)
- ❌ Retorna JSON com "decision": "deny"

**Status:** [ ] Passou  [ ] Falhou

---

## 🔌 MCP Servers (Opcional)

### Instalação

- [ ] Instalado `@modelcontextprotocol/server-github`
- [ ] Instalado `@modelcontextprotocol/server-filesystem`
- [ ] Token GitHub configurado em `.mcp.json`
- [ ] Path correto em `.mcp.json`

### Testes

#### MCP GitHub
```
/mcp__github__list-repositories
```

**Resultado esperado:**
- ✅ Lista repositórios do GitHub

**Status:** [ ] Passou  [ ] Falhou  [ ] N/A

---

#### MCP Filesystem
```
/mcp__filesystem__list-directory
```

**Resultado esperado:**
- ✅ Lista diretórios permitidos

**Status:** [ ] Passou  [ ] Falhou  [ ] N/A

---

## 📊 Resumo da Validação

### Comandos (5)
- [ ] /use-case
- [ ] /feature
- [ ] /pre-commit
- [ ] /db-migrate
- [ ] /arch-validate

**Total:** ___/5 funcionando

### Hooks (7 principais)
- [ ] Contexto Backend
- [ ] Contexto Frontend
- [ ] Sugestão Use Case
- [ ] Sugestão Feature
- [ ] Sugestão Pre-commit
- [ ] Proteção .env
- [ ] Validação Prisma

**Total:** ___/7 funcionando

### Templates (3 amostras)
- [ ] Domain Entity
- [ ] Repository Interface
- [ ] React Query Hook

**Total:** ___/3 funcionando

### Scripts (3)
- [ ] validate-architecture.sh
- [ ] format-typescript.sh
- [ ] validate-file-deletion.sh

**Total:** ___/3 funcionando

### MCP Servers (2) - Opcional
- [ ] GitHub
- [ ] Filesystem

**Total:** ___/2 funcionando

---

## 🎯 Critério de Aprovação

### ✅ Instalação Mínima Viável
- Comandos: 3/5 funcionando
- Hooks: 4/7 funcionando
- Templates: 2/3 funcionando
- Scripts: 2/3 funcionando

### 🌟 Instalação Completa
- Comandos: 5/5 funcionando
- Hooks: 7/7 funcionando
- Templates: 3/3 funcionando
- Scripts: 3/3 funcionando
- MCP: 2/2 configurados

---

## 🐛 Troubleshooting

### Se comandos não aparecem:
1. Reinicie Claude Code
2. Digite `/help` para listar comandos
3. Verifique sintaxe YAML nos arquivos `.md`

### Se hooks não funcionam:
1. Valide JSON em `.claude/hooks.json`
2. Verifique regex dos matchers
3. Reinicie Claude Code

### Se scripts falham:
1. Linux/Mac: `chmod +x scripts/hooks/*.sh`
2. Windows: Use Git Bash ou WSL
3. Teste manualmente cada script

### Se MCP não funciona:
1. Verifique instalação global: `npm list -g | grep mcp`
2. Verifique token GitHub
3. Verifique paths no `.mcp.json`

---

## ✅ Próximos Passos Após Validação

1. [ ] Documentar problemas encontrados
2. [ ] Resolver issues antes de usar em produção
3. [ ] Compartilhar com o time
4. [ ] Criar tutorial de onboarding
5. [ ] Adicionar ao README principal do projeto

---

## 📝 Notas

Data de teste: ________________

Testado por: ________________

Issues encontrados:
_________________________________
_________________________________
_________________________________

Melhorias sugeridas:
_________________________________
_________________________________
_________________________________

---

**Parabéns! 🎉**

Se você chegou até aqui e tudo está funcionando, você tem uma configuração profissional e completa do Claude Code!

**Próximo passo:** Comece a usar no desenvolvimento real e colete feedback do time.
