# 📚 Claude Code - Documentation Index

Índice completo de toda a documentação e configuração do Claude Code para este projeto.

## 🗂️ Estrutura de Arquivos

```
.claude/
├── 📄 INDEX.md                        # ← Você está aqui!
├── 📖 README.md                       # Overview e quick start
├── 📘 USAGE-GUIDE.md                  # Guia completo de uso (10k+ palavras)
├── 📗 SETUP-SUMMARY.md                # Resumo executivo do setup
├── ✅ INSTALLATION-CHECKLIST.md       # Checklist de validação
├── 🎬 EXAMPLE-WORKFLOW.md             # Exemplo prático passo a passo
├── 🎨 patterns.md                     # Templates de código (20+ templates)
├── ⚙️ hooks.json                      # Configuração de hooks (11 hooks)
└── commands/                          # Comandos customizados (5 comandos)
    ├── use-case.md                    # Criar use case backend
    ├── feature.md                     # Criar feature frontend
    ├── pre-commit.md                  # Validações pré-commit
    ├── db-migrate.md                  # Helper de migrations
    └── arch-validate.md               # Validar arquitetura
```

---

## 🚀 Por Onde Começar?

### Se você é novo no Claude Code:
1. 👉 **Comece aqui:** [README.md](./README.md) - Overview rápido
2. 📖 **Depois leia:** [USAGE-GUIDE.md](./USAGE-GUIDE.md) - Guia completo
3. 🎬 **Veja exemplo:** [EXAMPLE-WORKFLOW.md](./EXAMPLE-WORKFLOW.md) - Workflow prático

### Se você já conhece Claude Code:
1. ⚙️ **Configure:** [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md) - Valide setup
2. 📘 **Referência:** [patterns.md](./patterns.md) - Templates prontos
3. 🎯 **Use:** Comece com `/use-case` ou `/feature`

---

## 📖 Documentação por Categoria

### 🎓 Aprendizado

| Documento | Quando usar | Tempo |
|-----------|-------------|-------|
| [README.md](./README.md) | Primeira vez | 5 min |
| [USAGE-GUIDE.md](./USAGE-GUIDE.md) | Aprender detalhes | 20 min |
| [EXAMPLE-WORKFLOW.md](./EXAMPLE-WORKFLOW.md) | Ver na prática | 15 min |

### ⚙️ Configuração

| Documento | Quando usar | Tempo |
|-----------|-------------|-------|
| [SETUP-SUMMARY.md](./SETUP-SUMMARY.md) | Entender setup | 10 min |
| [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md) | Validar instalação | 30 min |
| [hooks.json](./hooks.json) | Customizar hooks | Variável |

### 📝 Referência

| Documento | Quando usar | Tempo |
|-----------|-------------|-------|
| [patterns.md](./patterns.md) | Copiar templates | Sempre |
| [commands/](./commands/) | Ver código dos comandos | Variável |

---

## 🎯 Comandos Disponíveis

### Comandos de Criação

```bash
/use-case <feature> <nome>    # Criar use case completo (backend)
/feature <nome>               # Criar módulo completo (frontend)
```

**Exemplos:**
```bash
/use-case payments create-payment
/feature notifications
```

### Comandos de Validação

```bash
/arch-validate               # Validar arquitetura
/pre-commit                  # Validações pré-commit
```

### Comandos de Database

```bash
/db-migrate <nome>           # Helper de migrations
```

**Exemplo:**
```bash
/db-migrate add-user-avatar
```

---

## 🪝 Hooks Configurados

### UserPromptSubmit (5 hooks)

| Hook | Ativa quando | Ação |
|------|--------------|------|
| Contexto Backend | Menciona "backend", "nestjs", etc. | Lembra Clean Architecture |
| Contexto Frontend | Menciona "frontend", "next.js", etc. | Lembra Feature-Sliced Design |
| Sugestão Use Case | Menciona "criar use case" | Sugere `/use-case` |
| Sugestão Feature | Menciona "criar feature" | Sugere `/feature` |
| Sugestão Pre-commit | Menciona "commit" | Sugere `/pre-commit` |

### PreToolUse (3 hooks)

| Hook | Ativa quando | Ação |
|------|--------------|------|
| Proteção .env | Tenta escrever em `.env` | Alerta sobre secrets |
| Proteção Arquivos | Tenta deletar arquivos críticos | Bloqueia ou alerta |
| Validação Migrations | Executa `prisma migrate` | Lembra validações |

### PostToolUse (3 hooks)

| Hook | Ativa quando | Ação |
|------|--------------|------|
| Validação Schema | Modifica `schema.prisma` | Sugere validar e migrar |
| Sugestão Testes | Cria use case | Lembra de criar testes |
| Teste Runtime | Modifica infra | Sugere rodar dev server |

---

## 🎨 Templates Disponíveis

### Backend (13 templates)

| Template | Localização em patterns.md | Uso |
|----------|----------------------------|-----|
| Domain Entity | Seção "Domain Entity Template" | Entidades de negócio |
| Repository Interface | Seção "Repository Interface Template" | Portas (interfaces) |
| DTOs | Seção "Application DTO Template" | Input/Output |
| Use Case | Seção "Use Case Template" | Casos de uso |
| Prisma Repository | Seção "Prisma Repository Implementation" | Adaptadores |
| Prisma Mapper | Seção "Prisma Mapper Template" | Conversão Domain ↔ Prisma |
| Controller | Seção "NestJS Controller Template" | Endpoints REST |
| Module | Seção "NestJS Module Template" | DI NestJS |
| Value Object | patterns.md (mencionado) | Objetos de valor |
| Decimal Handling | Seção "Decimal Handling" | Trabalhar com decimais |
| Transactions | Seção "Transactions" | Prisma transactions |
| Backend Test | Seção "Backend Unit Test Template" | Testes unitários |

### Frontend (5 templates)

| Template | Localização em patterns.md | Uso |
|----------|----------------------------|-----|
| TypeScript Types | Seção "TypeScript Types Template" | Interfaces |
| API Service | Seção "API Service Template" | Chamadas HTTP |
| React Query Hooks | Seção "React Query Hooks Template" | Hooks de dados |
| Component | Seção "Component Template" | Componentes React |
| Module Index | Seção "Module Index" | Barrel exports |

---

## 📊 Estatísticas

### Arquivos de Documentação
- **Total:** 8 arquivos principais
- **Linhas de código:** ~2500 linhas
- **Exemplos práticos:** 30+ exemplos
- **Comandos documentados:** 5 comandos

### Configuração
- **Hooks:** 11 configurados
- **Comandos:** 5 customizados
- **Templates:** 20+ prontos para uso
- **Scripts:** 3 auxiliares

### Tempo Economizado
- **Setup inicial:** 1-2 horas (one-time)
- **Por feature:** 4-6 horas → 30-45 min
- **Economia:** ~85% do tempo de desenvolvimento

---

## 🔍 Busca Rápida

### Como fazer X?

| Quero fazer... | Veja... |
|----------------|---------|
| Criar use case | `/use-case` ou [USAGE-GUIDE.md - use-case](./USAGE-GUIDE.md#use-case) |
| Criar feature frontend | `/feature` ou [USAGE-GUIDE.md - feature](./USAGE-GUIDE.md#feature) |
| Validar antes de commit | `/pre-commit` ou [USAGE-GUIDE.md - pre-commit](./USAGE-GUIDE.md#pre-commit) |
| Criar migration | `/db-migrate` ou [USAGE-GUIDE.md - db-migrate](./USAGE-GUIDE.md#db-migrate) |
| Ver templates | [patterns.md](./patterns.md) |
| Customizar hooks | [hooks.json](./hooks.json) |
| Ver exemplo completo | [EXAMPLE-WORKFLOW.md](./EXAMPLE-WORKFLOW.md) |
| Validar instalação | [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md) |

### Troubleshooting

| Problema | Solução |
|----------|---------|
| Comandos não aparecem | [USAGE-GUIDE.md - Troubleshooting](./USAGE-GUIDE.md#troubleshooting) |
| Hooks não funcionam | [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md) |
| Scripts falham | [SETUP-SUMMARY.md - Setup Técnico](./SETUP-SUMMARY.md#setup-técnico-adicional) |
| MCP não funciona | [USAGE-GUIDE.md - MCP Servers](./USAGE-GUIDE.md#mcp-servers) |

---

## 🎓 Trilha de Aprendizado

### Nível 1: Iniciante (30 min)
1. ✅ Ler [README.md](./README.md)
2. ✅ Testar `/use-case`
3. ✅ Testar `/feature`
4. ✅ Ler [EXAMPLE-WORKFLOW.md](./EXAMPLE-WORKFLOW.md)

### Nível 2: Intermediário (1-2 horas)
1. ✅ Ler [USAGE-GUIDE.md](./USAGE-GUIDE.md) completo
2. ✅ Explorar [patterns.md](./patterns.md)
3. ✅ Testar todos os comandos
4. ✅ Validar com [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md)

### Nível 3: Avançado (2-4 horas)
1. ✅ Estudar [hooks.json](./hooks.json)
2. ✅ Customizar comandos em `commands/`
3. ✅ Adicionar templates em [patterns.md](./patterns.md)
4. ✅ Configurar MCP servers
5. ✅ Criar workflows customizados

---

## 🔗 Links Externos

### Documentação Oficial
- [Claude Code Docs](https://code.claude.com/docs)
- [Slash Commands Guide](https://code.claude.com/docs/en/slash-commands.md)
- [Hooks Reference](https://code.claude.com/docs/en/hooks.md)
- [MCP Servers](https://code.claude.com/docs/en/mcp.md)

### Repositórios
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [MCP Servers](https://github.com/modelcontextprotocol)

---

## 📞 Suporte

### Para Issues do Projeto
- Abra issue no repositório do projeto
- Mencione qual comando/hook está falhando
- Inclua logs do Claude Code

### Para Issues do Claude Code
- [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- [Documentação Oficial](https://code.claude.com/docs)

---

## 🎉 Contribuindo

Quer melhorar a configuração?

1. **Adicionar Comando:**
   - Crie `.claude/commands/novo-comando.md`
   - Documente em [USAGE-GUIDE.md](./USAGE-GUIDE.md)
   - Atualize este [INDEX.md](./INDEX.md)

2. **Adicionar Hook:**
   - Edite [hooks.json](./hooks.json)
   - Documente em [USAGE-GUIDE.md](./USAGE-GUIDE.md)
   - Atualize este [INDEX.md](./INDEX.md)

3. **Adicionar Template:**
   - Edite [patterns.md](./patterns.md)
   - Adicione exemplo em [EXAMPLE-WORKFLOW.md](./EXAMPLE-WORKFLOW.md)
   - Atualize este [INDEX.md](./INDEX.md)

---

## 📅 Changelog

### v1.0.0 (2025-11-20)
- ✅ Setup inicial completo
- ✅ 5 comandos customizados
- ✅ 11 hooks automáticos
- ✅ 20+ templates
- ✅ Documentação completa (8 arquivos)
- ✅ Exemplo de workflow prático
- ✅ Checklist de instalação

---

## 🗺️ Roadmap

### Próximas Melhorias
- [ ] Comando `/component` para componentes individuais
- [ ] Hook para otimizações de performance
- [ ] Comando `/test` para gerar testes automaticamente
- [ ] Integração com CI/CD
- [ ] Templates para E2E tests
- [ ] Dashboard de métricas de produtividade

---

**Versão:** 1.0.0
**Última Atualização:** 2025-11-20
**Projeto:** Controle Econômico (NestJS + Next.js)

---

💡 **Dica:** Marque este arquivo como favorito! Use-o como ponto de entrada para toda a documentação do Claude Code.
