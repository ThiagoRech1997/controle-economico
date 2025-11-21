# Security Guidelines

Diretrizes de segurança para uso do Claude Code neste projeto.

## 🔐 Princípios de Segurança

### 1. Never Commit Secrets

❌ **NUNCA faça:**
```bash
# .env file
DATABASE_URL="sqlserver://user:password@localhost..."
GITHUB_TOKEN="ghp_actualtoken123456"
```

✅ **SEMPRE faça:**
```bash
# .env.example (committed)
DATABASE_URL="sqlserver://localhost:1433;database=mydb;..."
GITHUB_TOKEN="your-github-token-here"

# .env (in .gitignore, never committed)
DATABASE_URL="sqlserver://user:RealPassword@localhost..."
GITHUB_TOKEN="ghp_realtoken123456"
```

### 2. Hooks Safety

**Hooks run automatically with your credentials**. Never create hooks that:

❌ **Dangerous Operations:**
- Modify `.env` files automatically
- Execute `git push` or `git pull`
- Access credential stores
- Run `npm install` on untrusted packages
- Execute arbitrary user input
- Make network requests to external APIs

✅ **Safe Operations:**
- Read files for validation
- Run local linters/formatters
- Query local database schema
- Validate file patterns
- Suggest commands (not execute them)

### 3. Command Security

#### Bash Commands in Slash Commands

Your commands execute bash. Follow these rules:

❌ **Unsafe:**
```markdown
# DON'T: User input directly in bash
!`rm -rf ${USER_INPUT}`
!`git clone ${USER_PROVIDED_URL}`
```

✅ **Safe:**
```markdown
# DO: Sanitized, predictable operations
!`cd backend && npm run lint 2>&1`
!`npx prisma validate 2>&1`
```

#### Timeout Protection

Always add timeouts to prevent hanging:

```markdown
!`timeout 300 bash -c 'npm test' 2>&1`  # 5 minute max
```

### 4. MCP Server Security

#### GitHub Token

**Storage:**
- ❌ Don't commit `.mcp.json` with actual token
- ✅ Use environment variables
- ✅ Or use `.mcp.json.local` (in .gitignore)

**Permissions:**
Minimize GitHub token permissions:
- ✅ `repo:status` (read repository status)
- ✅ `public_repo` (if public repos only)
- ❌ `admin:org` (too broad)
- ❌ `delete_repo` (dangerous)

**Example:**
```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"  // From environment
      }
    }
  }
}
```

Then set in your shell:
```bash
# .bashrc or .zshrc
export GITHUB_TOKEN="ghp_yourtoken"
```

### 5. Database Security

#### Migrations

**Before running migrations:**
1. ✅ Review SQL in migration file
2. ✅ Test in development first
3. ✅ Backup production database
4. ✅ Have rollback plan

**Never:**
- ❌ Run `prisma db push --accept-data-loss` in production
- ❌ Run `prisma migrate reset` in production
- ❌ Execute raw SQL without review

#### Connection Strings

**Secure storage:**
```bash
# ❌ Hardcoded
DATABASE_URL="sqlserver://admin:Password123@prod.server.com"

# ✅ Environment variable
DATABASE_URL="${DATABASE_URL}"

# ✅ Secret management (e.g., AWS Secrets Manager)
DATABASE_URL="$(aws secretsmanager get-secret-value --secret-id db-url)"
```

### 6. File Operations

#### Deletions

Hooks protect critical files, but be careful:

**Protected files:**
- `schema.prisma`
- `package.json`
- `tsconfig.json`
- `.env` files

**Additional protections:**
```bash
# Add to .gitignore
.env
.env.local
.env.*.local
*.key
*.pem
credentials.json
```

#### Sensitive Data in Logs

**Never log:**
- Passwords
- API keys
- Database credentials
- User PII (Personally Identifiable Information)

**Example:**
```typescript
// ❌ Bad
console.log('Database URL:', process.env.DATABASE_URL);

// ✅ Good
console.log('Database connected successfully');
console.log('Database host:', new URL(process.env.DATABASE_URL).hostname);
```

---

## 🛡️ Hook Security Checklist

When creating new hooks, verify:

- [ ] Hook doesn't modify `.env` or credential files
- [ ] Hook doesn't execute `git push/pull`
- [ ] Hook doesn't install packages automatically
- [ ] Hook doesn't make external network requests
- [ ] Hook has timeout value set
- [ ] Matcher pattern is specific (not too broad)
- [ ] Hook logs don't expose secrets
- [ ] Hook operations are idempotent (can run multiple times)

---

## 🚨 Security Incidents

### If You Accidentally Commit Secrets

**Immediate Actions:**

1. **Revoke the credential immediately**
   - GitHub token: https://github.com/settings/tokens
   - Database password: Change on server
   - API keys: Regenerate from provider

2. **Remove from Git history**
   ```bash
   # Using BFG Repo Cleaner (recommended)
   bfg --replace-text passwords.txt
   git push --force

   # Or using git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push** (after team coordination)
   ```bash
   git push --force --all
   ```

4. **Notify team** if it's a shared repository

5. **Audit access logs** for unauthorized use

### Reporting Security Issues

**For this project:**
- Open private GitHub issue
- Email maintainers directly
- Don't disclose publicly until fixed

**For Claude Code:**
- Report to: security@anthropic.com
- Follow responsible disclosure

---

## 📋 Regular Security Audits

### Monthly Checks

- [ ] Review `.gitignore` includes all sensitive files
- [ ] Audit hooks.json for dangerous operations
- [ ] Check `.mcp.json` doesn't have hardcoded tokens
- [ ] Review recent commits for accidentally committed secrets
- [ ] Rotate API keys and tokens
- [ ] Update dependencies (`npm audit`)

### Before Production Deploy

- [ ] All secrets in environment variables
- [ ] Database credentials rotated
- [ ] API keys have minimum permissions
- [ ] Error logs don't expose sensitive data
- [ ] Backup procedures tested
- [ ] Rollback plan documented

---

## 🔑 Credential Management Best Practices

### Development Environment

```bash
# .env.example (committed)
DATABASE_URL="sqlserver://localhost:1433;database=dev;..."
GITHUB_TOKEN="your-token-here"
API_KEY="your-key-here"

# .env (gitignored, never committed)
DATABASE_URL="sqlserver://localhost:1433;database=dev;user=dev;password=DevPassword123"
GITHUB_TOKEN="ghp_actualdevtoken"
API_KEY="sk_actual_api_key"
```

### Production Environment

Use secret management services:

**AWS Secrets Manager:**
```typescript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const secret = await secretsManager.getSecretValue({
  SecretId: 'production/database'
});
```

**Azure Key Vault:**
```typescript
import { SecretClient } from '@azure/keyvault-secrets';

const secret = await client.getSecret('database-url');
```

**Environment Variables (minimum):**
```bash
# Production .env (on server, never in Git)
DATABASE_URL="${DATABASE_URL}"  # Set by deployment system
```

---

## 🎓 Security Training

### Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Common Vulnerabilities in This Stack

**NestJS/Backend:**
- SQL Injection (mitigated by Prisma)
- Command Injection (careful with `child_process`)
- Authentication bypass
- CORS misconfiguration

**Next.js/Frontend:**
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Exposed API keys in client code
- Server-side secrets leaked to client

**Prisma:**
- Connection string exposure
- Insufficient access control
- Migration vulnerabilities

---

## ✅ Security Checklist

Copy this for new features:

```markdown
## Security Review

- [ ] No hardcoded credentials
- [ ] Secrets in environment variables
- [ ] Input validation on all endpoints
- [ ] SQL injection protected (using Prisma)
- [ ] Authentication implemented
- [ ] Authorization checks in place
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain PII
- [ ] CORS properly configured
- [ ] Rate limiting on sensitive endpoints
- [ ] Dependencies audited (`npm audit`)
- [ ] Hooks don't perform dangerous operations
- [ ] .gitignore includes all sensitive files
```

---

## 📞 Security Contacts

**Project Maintainers:**
- See CONTRIBUTING.md

**Claude Code Security:**
- Email: security@anthropic.com
- GitHub: https://github.com/anthropics/claude-code/security

**Emergency:**
- Follow incident response plan
- Revoke credentials immediately
- Notify team ASAP

---

**Remember: Security is everyone's responsibility!** 🔒

**Last Updated:** 2025-11-20
**Next Review:** 2026-02-20 (quarterly)
