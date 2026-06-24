# Roteiro de Apresentacao — BankSim

> **Duracao estimada:** 15-20 minutos  
> **Stack pronta:** `docker compose up --build` (4 containers)

---

## Sumario da Apresentacao

| Etapa | Topico | Tempo |
|--------|--------|-------|
| 1 | Introducao — problema e objetivo | 2 min |
| 2 | Arquitetura — stack e diagrama | 3 min |
| 3 | Demo ao vivo — comandos no terminal | 5 min |
| 4 | Observabilidade — métricas, dashboards, alertas | 4 min |
| 5 | Sprints — o que foi construído em cada uma | 3 min |
| 6 | Conclusao — aprendizados e proximos passos | 2 min |

---

## 1. Introducao (2 minutos)

### Slide mental — O problema

> "Sistemas de monitoramento e observabilidade precisam de dados realistas para fazer sentido. Dashboards vazios não ensinam ninguém."

**Nosso projeto resolve isso:** um simulador de Internet Banking que gera tráfego realista — operações financeiras, autenticação, fraudes e falhas de infraestrutura — para que possamos **observar tudo acontecendo em tempo real** no Prometheus e Grafana.

### O que entregamos

- **17 endpoints REST** simulando um banco digital completo
- **27 métricas Prometheus** (counters, histograms, gauges)
- **5 dashboards Grafana** com thresholds coloridos e estatísticas
- **9 regras de alerta** configuradas
- **Logs JSON estruturados** em todos os eventos
- **CI/CD no GitHub Actions**

### Escopo claro (o que NÃO fizemos)

Sem banco real, sem JWT real, sem integração com BACEN. Tudo fake, em memória, focado no que importa: **gerar dados observáveis**.

---

## 2. Arquitetura (3 minutos)

### Stack

```
┌─────────────────────────────────────────────────┐
│  Frontend        Backend         Observabilidade │
│  React 18   →   Express 4   →   Prometheus      │
│  Vite 5         TypeScript 5     Grafana         │
│  Tailwind 3     Pino (logs)      :9090 / :3000   │
│  :5173          :3001            Docker Compose  │
└─────────────────────────────────────────────────┘
```

### Padrão de arquitetura no backend

Cada funcionalidade é um **módulo independente** seguindo separação de responsabilidades:

```
backend/src/modules/
├── auth/          → controllers, services, routes, dto, validators, types
├── finance/       → mesma estrutura
├── security/      → mesma estrutura
└── incidents/     → mesma estrutura
```

**Destaque técnico:** toda requisição registra:
- Métrica Prometheus (counter + histogram) com labels `method`, `endpoint`, `status_code`
- Log JSON estruturado com `timestamp`, `event_type`, `response_time`, `ip_address`

### Fluxo de uma requisição

```
[Usuário clica botão no Frontend]
  → Axios POST para o Backend
    → Validador confere o payload
      → Service aplica a lógica de negócio (fake)
        → Controller registra métrica + log
          → Resposta HTTP com latency no body
            → [Prometheus scrapeia /metrics a cada 5s]
              → [Grafana atualiza dashboards]
```

---

## 3. Demo ao Vivo (5 minutos)

> **Antes de começar:** `docker compose up --build` e abra 3 abas no navegador:  
> `http://localhost:5173` (frontend)  
> `http://localhost:3000` (Grafana, admin/admin)  
> `http://localhost:9090` (Prometheus)

### Passo 1 — Subir o sistema (30s)

```bash
docker compose up --build
# 4 containers: backend, frontend, prometheus, grafana
docker compose ps
```

Mostre que todos estão `Up`.

### Passo 2 — Dashboard do frontend (1 min)

Navegue pela interface mostrando:
- **Dashboard:** métricas ao vivo (health, incidentes ativos), cards dos endpoints
- **Segurança:** painel de auth + segurança avançada
- **Operações:** painel financeiro (PIX, boletos, saldo)
- **Incidentes:** painel de chaos engineering

### Passo 3 — Gerar dados reais (1 min)

Na aba **Operações**, dispare algumas requisições:
- Consultar Saldo → rápido (200 OK)
- Consultar Saldo Lento → delay artificial de 3-5s
- PIX Sucesso → 201 Created
- PIX sem Saldo → 422
- Pagar Boleto → 200 OK
- Boleto Vencido → 422

Mostre o **Log Panel** no final da página (eventos coloridos com status, endpoint e latência).

### Passo 4 — Simular incidente (1 min)

Na aba **Incidentes**:
1. Clique **Simular Queda** → health vira DOWN, dashboard fica vermelho
2. Mostre o `/api/v1/health` retornando `{"status":"DOWN"}`
3. Clique **Restaurar Sistema** → volta ao normal
4. Mostre o banner verde "Sistema saudavel"

### Passo 5 — Ver métricas no Prometheus (30s)

Abra `http://localhost:9090` e faça queries:
```promql
http_requests_total                    # Quantas requisições?
rate(http_requests_total[1m])          # Requisições por segundo?
login_failures_total                   # Quantas falhas de login?
pix_transactions_total                 # Quantos PIX?
active_incidents_total                 # Incidentes ativos?
```

### Passo 6 — Ver dashboards no Grafana (1 min)

Abra `http://localhost:3000` → **Dashboards** → **Internet Banking**:

Mostre cada dashboard e aponte:
- **Infraestrutura:** requests/s, latência P50/P95, taxa de erro, throughput
- **Segurança:** login failures subindo quando você clica "Login Falho"
- **Financeiro:** PIX/min aparecendo em tempo real
- **Segurança Avançada:** dispositivos registrados, brute force
- **Incidentes:** gauge de CPU/memória mudando com os incidentes

**Destaque visual:** thresholds verde→amarelo→vermelho, gradientes nos gráficos, legend com cálculos (min/max/avg).

### Passo 7 — Alertas (30s)

No Grafana, vá em **Alerting** → **Alert rules**:

Mostre as 9 regras configuradas:
- Brute Force (>10 falhas/min)
- Falha PIX elevada (>5/min)
- Serviço DOWN (>0 incidentes ativos por 30s)
- Explosão de erros 5xx (>20/min)

---

## 4. Observabilidade — Deep Dive (4 minutos)

### Métricas (27 no total)

| Categoria | Métricas | Tipo |
|-----------|----------|------|
| HTTP | `http_requests_total`, `http_request_duration_seconds`, `http_errors_total` | Counter + Histogram |
| Auth | `login_success_total`, `login_failures_total`, `mfa_*`, `auth_timeout_total` | Counters |
| Financeiro | `pix_transactions_total`, `pix_failures_total`, `boleto_*`, `transaction_volume_total` | Counters + Gauge |
| Segurança | `device_registrations_total`, `suspicious_actions_total`, `limit_changes_total`, `brute_force_attempts_total` | Counters |
| Incidentes | `incidents_total`, `service_down_total`, `timeout_events_total`, `simulated_cpu_usage`, `active_incidents_total` | Counters + Gauges |

### Labels utilizadas

Toda métrica HTTP usa labels `method`, `endpoint`, `status_code` — permitindo drill-down por recurso.

### Logs estruturados

Exemplo real de log gerado:
```json
{
  "timestamp": "2026-06-24T00:19:32.698Z",
  "event_type": "DEVICE_BLOCKED",
  "user_id": "user-1",
  "ip_address": "::1",
  "risk_level": "HIGH",
  "status_code": 403,
  "endpoint": "/api/v1/devices/register",
  "response_time": 67,
  "details": "Dispositivo bloqueado por suspeita de fraude"
}
```

**5 famílias de eventos de log:**
- Auth: `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `MFA_SUCCESS`, `MFA_FAILURE`, `AUTH_TIMEOUT`
- Finance: `PIX_SUCCESS`, `PIX_FAILURE`, `PIX_TIMEOUT`, `BALANCE_REQUEST`, `BOLETO_SUCCESS`
- Security: `DEVICE_REGISTERED`, `DEVICE_BLOCKED`, `LIMIT_CHANGED`, `SUSPICIOUS_ACTIVITY`, `BRUTE_FORCE_DETECTED`
- Incidents: `SERVICE_DOWN`, `TIMEOUT_EVENT`, `INTERNAL_ERROR`, `OVERLOAD_DETECTED`
- Health: `HEALTHCHECK_FAILED`

### Dashboards

**5 dashboards** provisionados via arquivos JSON (Grafana provisioning):
- Schema version 38, folder "Internet Banking"
- Timeseries com gradient fill e threshold colors
- Stat panels com `colorMode: background` (verde/amarelo/vermelho)
- Gauges para recursos simulados (CPU/memória)
- Table panels com colorização condicional

### Alertas

9 regras divididas em 4 grupos, com `for: 30s` para evitar flapping:

| Alerta | Condição | Severity |
|--------|----------|----------|
| Brute Force | `rate(login_failures_total[1m]) > 0.166` | critical |
| Timeout Auth | latência auth > 3s | warning |
| Falha PIX | `rate(pix_failures_total[1m]) > 0.083` | critical |
| Latência Financeira | latência > 3s | warning |
| Brute Force Avançado | `rate(brute_force_attempts_total[1m]) > 0.25` | critical |
| Atividade Suspeita | `rate(suspicious_actions_total[2m]) > 0.041` | critical |
| Serviço DOWN | `active_incidents_total > 0` | critical |
| Erros 5xx | `rate(http_errors_total[1m]) > 0.33` | critical |
| Latência Extrema | latência incidentes > 5s | critical |

---

## 5. Sprints — Progresso do Projeto (3 minutos)

### Sprint 1 — Fundação da Infraestrutura
- Projeto Node.js + TypeScript + Express
- Estrutura modular com controllers, services, middlewares
- Winston/Pino para logs JSON estruturados
- prom-client para métricas Prometheus
- Endpoint `/health` e `/metrics`
- Frontend React + Vite + Tailwind com layout base
- Docker Compose com 4 serviços
- Prometheus scrape config

### Sprint 2 — Autenticação e Segurança
- Módulo `auth`: login, MFA, logout
- 3 cenários por endpoint (sucesso, falha, timeout)
- Logs: `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `MFA_*`, `AUTH_TIMEOUT`
- Métricas: `login_success_total`, `login_failures_total`, `mfa_*`, histogram de latência auth
- Frontend AuthPanel com 7 botões
- Dashboard Grafana "Seguranca" + alerta brute force

### Sprint 3 — Operações Financeiras
- Módulo `finance`: consulta de saldo, PIX, pagamento de boleto
- Cenários: sucesso, saldo insuficiente (422), timeout BACEN (503), boleto vencido (422)
- Logs: `PIX_SUCCESS`, `PIX_FAILURE`, `PIX_TIMEOUT`, `BOLETO_*`
- Métricas: contadores PIX/boleto + histogram latência + gauge de volume
- Frontend FinancePanel com 9 botões
- Dashboard "Financeiro" + alertas PIX e latência

### Sprint 4 — Fraude e Segurança Avançada
- Módulo `security`: registro de dispositivo, alteração de limite PIX
- Simulações: brute force, atividade suspeita, dispositivo bloqueado
- Rate limiting: >5 mudanças de limite em 2 min = 429
- Logs: `DEVICE_REGISTERED`, `DEVICE_BLOCKED`, `SUSPICIOUS_ACTIVITY`, `BRUTE_FORCE_DETECTED`
- Métricas: `device_registrations_total`, `suspicious_actions_total`, `limit_changes_total`, `brute_force_attempts_total`
- Frontend SecurityPanel + dashboard "Seguranca Avancada"

### Sprint 5 — Incidentes e Chaos Engineering
- Módulo `incidents`: service-down, timeout, internal-error, overload, recover
- Health check state forçado (DOWN/UP via incidente)
- Gauges simulados: CPU (0-100%) e memória (0-100%)
- Logs: `SERVICE_DOWN`, `TIMEOUT_EVENT`, `INTERNAL_ERROR`, `OVERLOAD_DETECTED`
- Métricas: 5 counters + 3 gauges + histogram
- Frontend IncidentPanel com feedback visual (banner vermelho/verde)
- Dashboard "Incidentes" com gauge panels + alerta de serviço DOWN

### Sprint 6 — Dashboards Finais e CI/CD
- 5 dashboards unificados na pasta "Internet Banking"
- Thresholds, gradient fills, stat panels com background colorido
- 9 regras de alerta cobrindo todos os sprints
- GitHub Actions CI/CD: build backend, frontend e Docker
- README.md com documentação completa da arquitetura

---

## 6. Conclusao (2 minutos)

### O que aprendemos

1. **Observabilidade não é só métrica** — é a combinação de métricas (Prometheus), logs estruturados (Pino) e dashboards (Grafana) que contam a história do sistema
2. **Redundância controlada é didática** — simular falhas de forma intencional ensina mais do que esperar elas acontecerem
3. **Arquitetura modular escala** — os 4 módulos são independentes, cada um com suas próprias métricas e logs. Adicionar um novo módulo não quebra os existentes
4. **TypeScript + Node.js é produtivo** — tipagem forte evita bugs em runtime, especialmente nas DTOs e validators

### Pontos fortes do projeto

- **100% containerizado** — `docker compose up` sobe tudo
- **100% tipado** — TypeScript no backend e frontend
- **100% observável** — toda requisição gera métrica + log
- **CI/CD configurado** — push na main dispara build automático
- **5 dashboards + 9 alertas** provisionados como código

### Possíveis melhorias futuras

- Adicionar OpenTelemetry tracing para correlacionar requisições entre serviços
- Criar um worker de load generation para simular tráfego contínuo
- Configurar notification channels (Slack, email) nos alertas
- Adicionar persistência no Grafana (volume para `/var/lib/grafana`)
- Implementar testes automatizados (Jest no backend, Vitest no frontend)

---

## Apendice A — Comandos Úteis Durante a Apresentação

```bash
# Subir tudo
docker compose up --build

# Ver status dos containers
docker compose ps

# Saúde do backend
curl -s http://localhost:3001/api/v1/health | python3 -m json.tool

# Métricas Prometheus (filtrando as nossas)
curl -s http://localhost:3001/metrics | grep -E '^(http_|login_|pix_|boleto_|device_|suspicious_|limit_|brute_|incidents_|service_down|timeout_events|internal_errors|overload_events|simulated_|active_incidents)'

# Gerar incidente via API
curl -s -X POST http://localhost:3001/api/v1/incidents/service-down -H 'Content-Type: application/json' -d '{}'

# Recuperar sistema
curl -s -X POST http://localhost:3001/api/v1/incidents/recover -H 'Content-Type: application/json' -d '{}'

# Incidentes ativos
curl -s http://localhost:3001/api/v1/incidents/active | python3 -m json.tool

# Logs do backend (JSON estruturado)
docker logs banking-backend --tail 20

# Rodar CI localmente (simular o GitHub Actions)
cd backend && npm ci && npm run build
cd ../frontend && npm ci && npm run build
```

---

## Apendice B — Respostas para Possíveis Perguntas

**"Por que simular em vez de usar um banco real?"**
> O foco é observabilidade, não lógica de negócio bancário. Com simulações controladas, conseguimos gerar cenários específicos (timeout, erro 500, queda de serviço) sob demanda, o que seria muito difícil ou arriscado com um banco real.

**"As métricas são reais ou simuladas?"**
> Todas as métricas de requisição são reais — cada chamada HTTP incrementa os contadores e registra latência real. Apenas CPU e memória são gauges simulados (para demonstrar o conceito de resource monitoring).

**"Como os dashboards foram criados?"**
> Provisionados como código (JSON + YAML) — Grafana provisioning lê os arquivos da pasta `grafana/dashboards/` na inicialização. Nada foi criado manualmente na UI.

**"O que acontece se um alerta disparar?"**
> O alerta muda para estado `firing` no Grafana. Não configuramos notification channels (Slack/email) porque é um ambiente de demonstração, mas bastaria adicionar um contact point no `alert-rules.yml`.

**"Dá pra escalar isso?"**
> Sim. A arquitetura modular permite adicionar novos módulos (ex: investimentos, câmbio) sem alterar os existentes. Cada módulo teria suas próprias métricas, logs e dashboards.

**"Qual a cobertura de testes?"**
> Nenhum teste automatizado ainda — priorizamos a entrega funcional de ponta a ponta. Testes unitários e de integração seriam o próximo passo lógico.
