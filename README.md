# 💍 LUMA - Sites de Casamento

Plataforma SaaS para criação de sites de casamento personalizados.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse [http://localhost:3001](http://localhost:3001)

---

## 🔐 Configuração do Supabase (Obrigatório para multi-casais)

### 1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote a **URL** e **anon key** em: Settings > API

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Criar Tabelas no Supabase

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie o conteúdo de `supabase/schema.sql`
4. Execute a query

Isso criará:
- Tabela `events` com RLS (Row Level Security)
- Políticas de segurança para isolar dados por usuário
- Trigger para auto-update de `updated_at`

### 4. Ativar Confirmação de Email (Recomendado)

No dashboard do Supabase:

1. **Authentication > Providers > Email**
   - Marque ✅ **Confirm email**
   - Clique **Save**

2. **Authentication > URL Configuration**
   - **Site URL**: `http://localhost:3001` (dev) ou `https://seu-dominio.com` (produção)
   - **Redirect URLs** (adicione todos):
     ```
     http://localhost:3001/login
     http://localhost:3001/login?confirmed=true
     https://seu-dominio.com/login
     https://seu-dominio.com/login?confirmed=true
     ```

3. **Personalizar Email (opcional)**
   - Authentication > Email Templates
   - Customize o template "Confirm signup"

### 5. Configurar RSVP Seguro (Produção)

Para que o RSVP funcione com rate limiting:

1. No Supabase, execute `supabase/rsvp_security_patch.sql`
2. Configure no `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   RSVP_RATE_LIMIT_SALT=qualquer-string-secreta
   ```

> A service role key está em: Settings > API > service_role (secret)

### 6. Testar Login

1. Inicie o servidor: `npm run dev`
2. Acesse http://localhost:3001/login
3. Crie uma conta com email/senha
4. Se email confirmation ativada: verifique email e clique no link
5. Faça login e acesse o dashboard

### 7. Testar Criação de Evento

1. No dashboard, clique em "Criar Meu Evento"
2. Um novo evento será criado no Supabase
3. Edite os campos - as alterações são salvas automaticamente

---

## 📁 Estrutura do Projeto

```
src/
├── app/           # Rotas Next.js (App Router)
├── components/    # Componentes React
├── config/        # Configurações
├── contexts/      # Estado global (BriefingContext, CartContext)
├── lib/           # Utilitários + Supabase clients
│   └── supabase/  # Clientes Supabase (client.ts, server.ts)
├── services/      # Serviços
└── types/         # Tipos TypeScript

supabase/
└── schema.sql     # Schema do banco de dados

middleware.ts      # Proteção de rotas /dashboard/*
```

---

## 📚 Documentação

Para contexto completo do projeto (útil para IA/LLMs):

- [`.agent/PROJECT.md`](.agent/PROJECT.md) - Visão geral do projeto
- [`.agent/ARCHITECTURE.md`](.agent/ARCHITECTURE.md) - Estrutura de pastas
- [`.agent/CONVENTIONS.md`](.agent/CONVENTIONS.md) - Padrões de código
- [`AUDIT_PROJECT.md`](AUDIT_PROJECT.md) - Auditoria completa do repositório

---

## 🛠️ Tech Stack

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Supabase** - Auth + Database

---

## 📝 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run start    # Iniciar produção
npm run lint     # Verificar lint
npm run test     # Rodar testes
```

---

## 🔧 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim* | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim* | Chave anônima do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Para RSVP | Chave de serviço (server-side only) |
| `RSVP_RATE_LIMIT_SALT` | Para RSVP | Salt para hash de IPs |

*Se não configuradas, o app usa localStorage (modo desenvolvimento).

---

## 🔒 Segurança

- **RLS (Row Level Security)**: Cada usuário só vê seus próprios eventos
- **Middleware**: Rotas `/dashboard/*` protegidas por autenticação
- **Sessões**: Gerenciadas automaticamente pelo Supabase

---

## License

MIT © LUMA
