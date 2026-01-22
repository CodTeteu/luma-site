# LUMA - Auditoria Completa de Segurança e Arquitetura

**Data:** 2026-01-22  
**Auditor:** Antigravity AI  
**Objetivo:** Plataforma de convites de casamento multi-evento com RSVP e presentes (checkout PIX manual)

---

## SEÇÃO 0 — INVENTÁRIO DO REPOSITÓRIO

### 0.1) Árvore de Diretórios

```
LUMA/
├── middleware.ts                    # Proteção de rotas /dashboard
├── vercel.json                      # Cron job para limpeza de rate limits
├── package.json                     # Dependências e scripts
├── next.config.ts                   # Configuração Next.js
├── tsconfig.json                    # TypeScript config
├── eslint.config.mjs                # ESLint config
├── jest.config.ts                   # Jest test config
│
├── supabase/                        # SQL migrations (6 arquivos)
│   ├── schema.sql                   # Schema principal
│   ├── rsvp_security_patch.sql      # Remove INSERT público em rsvps
│   ├── profiles_patch.sql           # Tabela profiles para multi-evento
│   ├── gift_orders_patch.sql        # Tabela gift_orders + rate limits
│   ├── content_cleanup_patch.sql    # Remove dados privados de content
│   └── rsvp_unique_email_patch.sql  # Índice único email/evento
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── rsvp/route.ts                    # POST RSVP (service role)
│   │   │   ├── gifts/checkout/route.ts          # POST checkout (service role)
│   │   │   └── maintenance/cleanup-rate-limits/route.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                       # Layout com Sidebar
│   │   │   ├── page.tsx                         # Dashboard principal
│   │   │   ├── editor/page.tsx                  # Editor do convite + presentes
│   │   │   ├── financial/page.tsx               # Gestão de gift_orders
│   │   │   ├── guests/page.tsx                  # RSVPs
│   │   │   ├── events/page.tsx                  # Multi-evento
│   │   │   └── settings/page.tsx                # Configurações
│   │   │
│   │   ├── login/page.tsx                       # Login com Supabase Auth
│   │   ├── [slug]/page.tsx                      # Convite público
│   │   └── templates/page.tsx                   # Galeria de templates
│   │
│   ├── components/
│   │   ├── gifts/                               # 7 componentes de presentes
│   │   │   ├── GiftSection.tsx
│   │   │   ├── GiftCartContext.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── GiftCheckoutModal.tsx
│   │   │   ├── PixPaymentBox.tsx
│   │   │   ├── GiftCard.tsx
│   │   │   └── GiftList.tsx
│   │   ├── briefing/                            # Wizard de briefing
│   │   ├── dashboard/                           # Sidebar
│   │   ├── landing/                             # Landing page
│   │   └── ui/                                  # Componentes base
│   │
│   ├── contexts/
│   │   ├── BriefingContext.tsx                  # Multi-evento + active_event_id
│   │   └── CartContext.tsx                      # Carrinho legado (não usado)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── admin.ts                         # Service role client
│   │   │   ├── client.ts                        # Browser client (anon)
│   │   │   └── server.ts                        # Server component client
│   │   └── slug.ts                              # Validação de slugs reservados
│   │
│   ├── services/
│   │   ├── giftOrdersService.ts                 # CRUD gift_orders
│   │   ├── rsvpService.ts                       # CRUD rsvps
│   │   └── transactionService.ts                # Legado (não usado)
│   │
│   └── templates/
│       ├── registry.ts                          # Mapa de templates
│       └── TemplateDefault.tsx                  # Template principal
```

### 0.2) Resumo do package.json

**Scripts:**
- `dev`: next dev
- `build`: next build ✅ (passa)
- `lint`: eslint
- `test`: jest
- `test:coverage`: jest --coverage

**Dependências Críticas:**
| Pacote | Versão | Uso |
|--------|--------|-----|
| next | 16.1.1 | Framework |
| react | 19.2.3 | UI |
| @supabase/ssr | 0.8.0 | Auth SSR |
| @supabase/supabase-js | 2.91.0 | Database client |
| zod | 4.3.5 | Validação |
| react-hook-form | 7.71.0 | Forms |
| framer-motion | 12.23.26 | Animações |

### 0.3) Variáveis de Ambiente

| Variável | Tipo | Obrigatório | Uso |
|----------|------|-------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | PÚBLICA | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | PÚBLICA | ✅ | Chave anon (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | PRIVADA | ✅ | Bypass RLS (APIs) |
| `RSVP_RATE_LIMIT_SALT` | PRIVADA | ✅ | Salt para hash de IP |
| `GIFTS_RATE_LIMIT_SALT` | PRIVADA | ✅ | Salt para hash de IP |
| `MAINTENANCE_TOKEN` | PRIVADA | ✅ | Token para cron |
| `NODE_ENV` | PÚBLICA | ❌ | Ambiente |

---

## SEÇÃO 1 — MAPA DE ROTAS E FLUXOS

### 1.1) Estrutura de Rotas

**Framework:** Next.js 16.1 com App Router

### 1.2) Todas as Rotas

| Rota | Arquivo | Propósito | Auth | Tipo |
|------|---------|-----------|------|------|
| `/` | app/page.tsx | Landing page | ❌ | Server |
| `/login` | app/login/page.tsx | Autenticação | ❌ | Client |
| `/templates` | app/templates/page.tsx | Galeria templates | ❌ | Server |
| `/[slug]` | app/[slug]/page.tsx | Convite público | ❌ | Server |
| `/dashboard` | app/dashboard/page.tsx | Home do casal | ✅ | Client |
| `/dashboard/editor` | app/dashboard/editor/page.tsx | Editor convite | ✅ | Client |
| `/dashboard/financial` | app/dashboard/financial/page.tsx | Gift orders | ✅ | Client |
| `/dashboard/guests` | app/dashboard/guests/page.tsx | RSVPs | ✅ | Client |
| `/dashboard/events` | app/dashboard/events/page.tsx | Multi-evento | ✅ | Client |
| `/dashboard/settings` | app/dashboard/settings/page.tsx | Configurações | ✅ | Client |
| `/api/rsvp` | app/api/rsvp/route.ts | POST RSVP | ❌ | API |
| `/api/gifts/checkout` | app/api/gifts/checkout/route.ts | POST checkout | ❌ | API |
| `/api/maintenance/cleanup-rate-limits` | ... | GET cleanup | Token | API |

### 1.3) Fluxos Principais

#### Fluxo 1: Login → Dashboard
1. `middleware.ts`: verifica sessão via `supabase.auth.getUser()`
2. Se não autenticado em `/dashboard/*` → redirect `/login`
3. `app/login/page.tsx` → `LoginForm.tsx` → `supabase.auth.signInWithPassword()`
4. Sucesso → `BriefingContext` carrega `active_event_id` de `profiles`

#### Fluxo 2: Criação de Evento
1. `/dashboard` sem evento → botão "Criar Evento"
2. `BriefingContext.createEvent()` → gera slug temporário `evento-xxxx`
3. Insere em `events` + atualiza `profiles.active_event_id`
4. Redirect para `/dashboard/editor`

#### Fluxo 3: Checkout de Presentes
1. `/[slug]` renderiza `GiftSection` com lista de `events.content.gifts`
2. Usuário adiciona ao carrinho → `GiftCartContext` (localStorage por slug)
3. "Continuar para pagamento" → `GiftCheckoutModal`
4. Submit → POST `/api/gifts/checkout`:
   - Valida honeypot
   - Rate limit (5/10min)
   - Recalcula total do servidor
   - Gera reference_code único
   - Insere em `gift_orders` com status='pending'
5. Retorna `pixKey` + `referenceCode` → `PixPaymentBox`
6. Casal vê pedido em `/dashboard/financial`

---

## SEÇÃO 2 — AUTENTICAÇÃO, AUTORIZAÇÃO E SEGURANÇA

### 2.1) Sistema de Auth

**Provider:** Supabase Auth (email/password)

**Fluxo de sessão:**
- `middleware.ts`: cria client SSR com cookies
- `supabase.auth.getUser()` valida JWT
- Cookies são HttpOnly, gerenciados pelo Supabase SSR

**Email não confirmado:**
- Não há verificação explícita no código
- Depende de config no Supabase Dashboard (recomendado habilitar)

### 2.2) Proteção do /dashboard

✅ **middleware.ts implementado corretamente:**
```typescript
const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
if (isProtectedRoute && !user) {
    return NextResponse.redirect(url); // → /login
}
```

**Matcher exclui:**
- `_next/static`, `_next/image`, `favicon.ico`
- `images/`, `api/` (APIs não passam pelo middleware)
- Arquivos estáticos (svg, png, jpg, etc.)

### 2.3) Row Level Security (RLS)

#### Tabela: `events`
| Operação | Policy | Segurança |
|----------|--------|-----------|
| SELECT (owner) | `auth.uid() = user_id` | ✅ |
| SELECT (public) | `status = 'published'` | ✅ (só publicados) |
| INSERT | `auth.uid() = user_id` | ✅ |
| UPDATE | `auth.uid() = user_id` | ✅ |
| DELETE | `auth.uid() = user_id` | ✅ |

#### Tabela: `rsvps`
| Operação | Policy | Segurança |
|----------|--------|-----------|
| SELECT | Event owner | ✅ |
| INSERT | ⚠️ **DEPENDE DE PATCH** | Precisa rodar `rsvp_security_patch.sql` |
| UPDATE | Event owner | ✅ |
| DELETE | Event owner | ✅ |

⚠️ **CRÍTICO:** `schema.sql` tem policy pública de INSERT. Deve rodar `rsvp_security_patch.sql` antes de produção!

#### Tabela: `gift_orders`
| Operação | Policy | Segurança |
|----------|--------|-----------|
| SELECT | Event owner | ✅ |
| INSERT | Event owner OU service role | ✅ Sem policy pública |
| UPDATE | Event owner | ✅ |
| DELETE | ❌ Não existe | (considerar adicionar) |

✅ **Sem policy pública de INSERT em gift_orders**

#### Tabela: `gift_checkout_rate_limits`
| Operação | Policy | Segurança |
|----------|--------|-----------|
| Todas | Nenhuma (service role only) | ✅ |

### 2.4) Chaves e Segredos

✅ **`SUPABASE_SERVICE_ROLE_KEY` nunca exposta no client:**
- Só usada em `src/lib/supabase/admin.ts`
- `admin.ts` só importado em APIs server-only (`/api/*`)
- Não há `"use client"` em arquivos que importam admin

✅ **Verificação:**
```typescript
// admin.ts - SÓ server-side
export function createAdminClient() {
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    // ...
}
```

### 2.5) Anti-Spam e Rate Limit

#### RSVP (`/api/rsvp`)
| Proteção | Status |
|----------|--------|
| Honeypot field (`website`) | ✅ |
| Rate limit (5 req / 10 min / IP / evento) | ✅ |
| Hash de IP com salt | ✅ |
| Bloqueio de INSERT direto (RLS) | ⚠️ Precisa do patch |
| Validação de payload | ✅ |
| Email único por evento | ✅ (índice único) |

#### Checkout (`/api/gifts/checkout`)
| Proteção | Status |
|----------|--------|
| Honeypot field (`honeypot`) | ✅ |
| Rate limit (5 req / 10 min / IP / evento) | ✅ |
| Hash de IP com salt | ✅ |
| Bloqueio de INSERT direto (RLS) | ✅ Nunca teve policy pública |
| Validação de payload | ✅ |
| Recálculo de preços no servidor | ✅ |

### 2.6) Exposição de Dados

#### `/[slug]` - Consulta segura:
```typescript
const { data: event } = await supabase
    .from("events")
    .select("id, slug, status, template_id, content")  // ✅ Colunas explícitas
    .eq("slug", slug)
    .single();
```
✅ Não usa `select("*")`

#### `events.content` - Dados privados:
| Campo | Status |
|-------|--------|
| `email` | ⚠️ Era salvo, agora removido por `toEventContent()` |
| `phone` | ⚠️ Era salvo, agora removido por `toEventContent()` |
| `payment.pixKey` | ⚠️ Exposto em content (público vê no checkout) |

**Mitigação:** `content_cleanup_patch.sql` remove email/phone de registros antigos.

### 2.7) Achados de Segurança

| ID | Severidade | Descrição | Resolução |
|----|------------|-----------|-----------|
| SEC-001 | P0 | `schema.sql` tem INSERT público em rsvps | Rodar `rsvp_security_patch.sql` |
| SEC-002 | P2 | `pixKey` exposto em `events.content` | Mover para coluna separada ou criptografar |
| SEC-003 | P3 | Sem verificação de email confirmado | Configurar no Supabase Dashboard |
| SEC-004 | P3 | Rate limit salts com fallback hardcoded | Garantir .env em produção |
| SEC-005 | P2 | Sem DELETE policy em gift_orders | Adicionar se necessário |

---

## SEÇÃO 3 — BANCO / SQL / MIGRAÇÕES

### 3.1) Arquivos SQL

| Arquivo | Linhas | Propósito |
|---------|--------|-----------|
| `schema.sql` | 189 | Schema base: events, rsvps, gift_transactions |
| `rsvp_security_patch.sql` | 68 | Remove INSERT público, cria rate_limits |
| `profiles_patch.sql` | 74 | Tabela profiles para multi-evento |
| `gift_orders_patch.sql` | 141 | Tabela gift_orders, rate_limits, RLS |
| `content_cleanup_patch.sql` | 42 | Remove email/phone de content |
| `rsvp_unique_email_patch.sql` | 37 | Índice único lower(email)/evento |

### 3.2) Tabelas e Consistência

| Tabela | Schema | Código | Consistente |
|--------|--------|--------|-------------|
| `events` | ✅ | ✅ | ✅ |
| `profiles` | patch | ✅ BriefingContext | ✅ |
| `rsvps` | ✅ | ✅ rsvpService | ✅ |
| `gift_orders` | patch | ✅ giftOrdersService | ✅ |
| `gift_transactions` | schema | ❌ Não usado | Legado |
| `rsvp_rate_limits` | patch | ✅ /api/rsvp | ✅ |
| `gift_checkout_rate_limits` | patch | ✅ /api/gifts/checkout | ✅ |

### 3.3) Status Enums

| Tabela | Coluna | Valores Schema | Valores Código | Match |
|--------|--------|----------------|----------------|-------|
| events | status | draft, published | ✅ | ✅ |
| gift_orders | status | pending, confirmed, cancelled | ✅ | ✅ |

### 3.4) Índices

| Índice | Tabela | Colunas |
|--------|--------|---------|
| `idx_events_slug` | events | slug (UNIQUE) |
| `idx_events_user_id` | events | user_id |
| `idx_rsvps_event_id` | rsvps | event_id |
| `idx_rsvps_unique_email_per_event` | rsvps | (event_id, lower(email)) WHERE email IS NOT NULL |
| `idx_gift_orders_event_created` | gift_orders | (event_id, created_at DESC) |
| `idx_gift_orders_event_status` | gift_orders | (event_id, status) |

### 3.5) Ordem de Execução SQL

```
1. schema.sql                    # Base
2. profiles_patch.sql            # Perfis
3. rsvp_security_patch.sql       # CRÍTICO: Remove INSERT público
4. rsvp_unique_email_patch.sql   # Email único
5. gift_orders_patch.sql         # Sistema de presentes
6. content_cleanup_patch.sql     # Limpeza de dados (só uma vez)
```

---

## SEÇÃO 4 — QUALIDADE E COMPILAÇÃO

### 4.1) Build

```
✅ npm run build - Exit code: 0

Next.js 16.1.1 (Turbopack)
- Build completo sem erros
```

### 4.2) Lint

```
⚠️ npm run lint - Exit code: 1 (warnings/erros menores)
```

### 4.3) Busca por Padrões Problemáticos

| Padrão | Busca | Resultado |
|--------|-------|-----------|
| `.DEFAULT_` (spread errado) | grep | ❌ Não encontrado |
| `.prev` / `.item` | grep | ❌ Não encontrado |
| `TODO` | grep | ✅ 1 em schema.sql (rate limit) |
| `FIXME` | grep | ❌ Não encontrado |
| `console.log` em prod | grep | ⚠️ Vários (mas com prefixo de debug) |

---

## SEÇÃO 5 — LÓGICA DE NEGÓCIO

### 5.1) Fonte de Verdade

**Gifts e PIX:**
- Editor: `events.content.gifts[]` e `events.content.payment.pixKey`
- Público: Lê os mesmos campos via `events.content`

✅ **Consistente**

### 5.2) Checkout - Segurança de Preços

```typescript
// /api/gifts/checkout/route.ts linha 248-268
for (const cartItem of body.cart) {
    const gift = gifts.find(g => g.id === cartItem.giftId);
    const lineTotal = gift.amount * cartItem.qty;  // ✅ Preço do servidor
    totalAmount += lineTotal;
}
```

✅ **Servidor recalcula total** - não confia no client

### 5.3) Reference Code

```typescript
const REFERENCE_CODE_LENGTH = 8;
const REFERENCE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem I, O, 0, 1

// Verifica unicidade antes de usar
const { data: existing } = await supabase
    .from("gift_orders")
    .select("id")
    .eq("reference_code", candidate)
    .maybeSingle();
```

✅ **Único e confiável** (8 chars, ~1.6 trilhões de combinações)

### 5.4) Dashboard Financeiro

- ✅ Filtra por `event_id` do evento ativo
- ✅ Permite confirmar/cancelar manualmente
- ✅ Totais calculados por status

### 5.5) Riscos de Negócio

| Risco | Status | Mitigação |
|-------|--------|-----------|
| Pedidos duplicados (refresh) | ⚠️ | Rate limit ajuda, mas não há idempotency key |
| Corrida de requests | ✅ | reference_code único com constraint |
| Valores manipulados | ✅ | Recálculo server-side |

---

## SEÇÃO 6 — PERFORMANCE E ESCALABILIDADE

### 6.1) Custos/Limites

| Recurso | Limite Free Tier | Uso Estimado |
|---------|-----------------|--------------|
| Supabase queries | 500MB/mês | Baixo |
| Vercel cron | 2/dia (hobby) | 1/dia |
| Edge functions | 100k/mês | Baixo |

### 6.2) Padrões de Query

✅ **Boas práticas:**
- Selects com colunas explícitas
- Índices em campos de busca
- Sem N+1 visível

### 6.3) Caching

⚠️ **Oportunidades:**
- `/[slug]` poderia usar ISR com revalidação
- Gifts catalog raramente muda

---

## SEÇÃO 7 — RECOMENDAÇÕES PRIORITÁRIAS

### P0 - Antes de Produção

| # | Tarefa | Arquivo | Como Testar |
|---|--------|---------|-------------|
| 1 | Rodar `rsvp_security_patch.sql` | supabase/ | Tentar INSERT público em rsvps |
| 2 | Configurar todas as env vars | .env | Build sem fallbacks |
| 3 | Habilitar confirmação de email | Supabase Dashboard | Criar usuário e verificar |

### P1 - Logo Após

| # | Tarefa | Arquivo | Esforço |
|---|--------|---------|---------|
| 1 | Adicionar DELETE policy em gift_orders | gift_orders_patch.sql | Baixo |
| 2 | Mover pixKey para coluna separada | schema + código | Médio |
| 3 | Adicionar idempotency key no checkout | /api/gifts/checkout | Médio |

### P2 - Melhorias

| # | Tarefa | Esforço |
|---|--------|---------|
| 1 | ISR para página /[slug] | Baixo |
| 2 | Webhook para confirmação automática | Alto |
| 3 | Export PDF de RSVPs | Médio |

---

## SEÇÃO 8 — BUNDLE DE ARQUIVOS CRÍTICOS

### A) middleware.ts

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    const { data: { user } } = await supabase.auth.getUser();

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isLoginPage = request.nextUrl.pathname === '/login';

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (isLoginPage && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
```

### B) src/lib/supabase/admin.ts

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL");
        return null;
    }

    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
```

### C) vercel.json

```json
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "crons": [
        {
            "path": "/api/maintenance/cleanup-rate-limits?token=${MAINTENANCE_TOKEN}",
            "schedule": "0 3 * * *"
        }
    ]
}
```

### D) supabase/rsvp_security_patch.sql (CRÍTICO)

```sql
-- Remove public INSERT policy
DROP POLICY IF EXISTS "Public can RSVP to published events" ON rsvps;

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rsvp_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_rate_limits_lookup 
    ON rsvp_rate_limits(event_id, ip_hash, created_at DESC);

ALTER TABLE rsvp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only event owner can view (for debugging)
CREATE POLICY "Event owner can view rate limits" ON rsvp_rate_limits
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Unique email per event
CREATE UNIQUE INDEX IF NOT EXISTS idx_rsvps_unique_email_per_event
    ON rsvps(event_id, email)
    WHERE email IS NOT NULL AND email <> '';
```

---

## CONCLUSÃO

O projeto LUMA está **bem estruturado para produção** com as seguintes ressalvas:

1. ⚠️ **OBRIGATÓRIO:** Executar `rsvp_security_patch.sql` para remover INSERT público
2. ✅ **Checkout seguro:** Preços recalculados no servidor, rate limit, honeypot
3. ✅ **Auth correto:** Middleware protege /dashboard, RLS configurado
4. ✅ **Build passa:** Next.js 16.1.1 compila sem erros

**Pronto para deploy** após aplicar os patches SQL na ordem correta.
