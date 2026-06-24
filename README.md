# Internet Banking Observability Simulator

Simulador de operações bancárias (PIX, boletos, autenticação, segurança) para geração de métricas, logs estruturados e incidentes — monitorados com **Prometheus + Grafana**.

---

## Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                      Docker Compose                          │
│                                                              │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │  Frontend   │──▶│   Backend    │◀──│   Prometheus     │  │
│  │  React 18   │   │  Express 4   │   │   scrape 5s      │  │
│  │  Vite 5     │   │  Node 20     │   │   :9090          │  │
│  │  :5173      │   │  :3001       │   └────────┬─────────┘  │
│  └─────────────┘   └──────┬───────┘            │            │
│                            │                    ▼            │
│                            │            ┌──────────────┐    │
│                     ┌──────▼───────┐    │   Grafana    │    │
│                     │  Métricas    │    │   :3000      │    │
│                     │  /metrics    │    │   5 dash     │    │
│                     │  27 métricas │    │   11 alertas │    │
│                     └──────────────┘    └──────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 + Axios |
| Backend | Node.js 20 + Express 4 + TypeScript 5 |
| Logs | Pino (JSON estruturado) |
| Métricas | prom-client (27 métricas custom) |
| Monitoramento | Prometheus + Grafana |
| Containers | Docker Compose (4 serviços) |
| CI/CD | GitHub Actions |

### Backend — Arquitetura Modular em Camadas

Cada funcionalidade é um **módulo independente** com seus próprios controllers, services, routes, DTOs, validators e types:

```
backend/src/
├── modules/
│   ├── auth/          # Sprint 2 — Autenticação
│   ├── finance/       # Sprint 3 — PIX, boletos, saldo
│   ├── security/      # Sprint 4 — Fraude, dispositivos, limites
│   └── incidents/     # Sprint 5 — Chaos engineering
├── controllers/       # Health check
├── services/          # Health state management
├── middlewares/       # Logger + Métricas HTTP
├── metrics/           # Prometheus (prom-client)
├── routes/            # Router central
└── utils/             # Logger Pino
```

---

## Como Rodar

### Pré-requisitos

- Docker + Docker Compose
- Node.js 20+ (para dev local)

### Docker Compose (recomendado)

```bash
docker compose up --build
```

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | — |
| Backend | http://localhost:3001 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3000 | admin / admin |

### Dev Local (sem Docker)

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

---

## Endpoints da API

Todos prefixados com `/api/v1`.

### Health

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check (UP/DOWN) |

### Auth (Sprint 2)

| Método | Path | Cenários |
|--------|------|----------|
| POST | `/auth/login` | Sucesso (200), senha inválida (401), timeout (503) |
| POST | `/auth/mfa` | Token válido (200), inválido (401), expirado (403) |
| POST | `/auth/logout` | Logout (200) |

### Financeiro (Sprint 3)

| Método | Path | Cenários |
|--------|------|----------|
| GET | `/account/balance` | Saldo rápido ou lento (`?slow=true`) |
| POST | `/transactions/pix` | Sucesso (201), saldo insuficiente (422), timeout BACEN (503) |
| POST | `/payments/boleto` | Sucesso (200), inválido (400), vencido (422) |

### Segurança (Sprint 4)

| Método | Path | Cenários |
|--------|------|----------|
| POST | `/devices/register` | Registro (201), dispositivo suspeito (403) |
| PUT | `/user/limits` | Alteração (200), muitas alterações (429) |
| POST | `/security/simulate/brute-force` | Brute force detectado (403) |
| POST | `/security/simulate/suspicious` | Atividade suspeita (403) |

### Incidentes (Sprint 5)

| Método | Path | Cenários |
|--------|------|----------|
| POST | `/incidents/service-down` | Healthcheck → DOWN (503) |
| POST | `/incidents/timeout` | Delay artificial (504) |
| POST | `/incidents/internal-error` | Erro 500 controlado |
| POST | `/incidents/overload` | Sobrecarga simulada (503) |
| POST | `/incidents/recover` | Restaura sistema (200) |
| GET | `/incidents/active` | Lista incidentes ativos |

### Métricas Prometheus

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/metrics` | Registry completo para Prometheus |

---

## Métricas Prometheus

### HTTP
| Métrica | Tipo |
|---------|------|
| `http_requests_total` | Counter |
| `http_request_duration_seconds` | Histogram |
| `http_errors_total` | Counter |

### Auth (Sprint 2)
| Métrica | Tipo |
|---------|------|
| `login_success_total` | Counter |
| `login_failures_total` | Counter |
| `mfa_success_total` | Counter |
| `mfa_failures_total` | Counter |
| `auth_timeout_total` | Counter |
| `auth_request_duration_seconds` | Histogram |

### Financeiro (Sprint 3)
| Métrica | Tipo |
|---------|------|
| `pix_transactions_total` | Counter |
| `pix_failures_total` | Counter |
| `pix_timeout_total` | Counter |
| `boleto_payments_total` | Counter |
| `boleto_failures_total` | Counter |
| `finance_request_duration_seconds` | Histogram |
| `transaction_volume_total` | Gauge |

### Segurança (Sprint 4)
| Métrica | Tipo |
|---------|------|
| `device_registrations_total` | Counter |
| `suspicious_actions_total` | Counter |
| `limit_changes_total` | Counter |
| `brute_force_attempts_total` | Counter |
| `security_request_duration_seconds` | Histogram |

### Infraestrutura (Sprint 5)
| Métrica | Tipo |
|---------|------|
| `incidents_total` | Counter |
| `service_down_total` | Counter |
| `timeout_events_total` | Counter |
| `internal_errors_total` | Counter |
| `overload_events_total` | Counter |
| `simulated_cpu_usage` | Gauge |
| `simulated_memory_usage` | Gauge |
| `active_incidents_total` | Gauge |
| `incident_request_duration_seconds` | Histogram |

---

## Dashboards Grafana

Todos na pasta **Internet Banking** (`http://localhost:3000/dashboards`).

| Dashboard | UID | Painéis |
|-----------|-----|---------|
| **Infraestrutura** | `sprint1-infra` | Requests/s, latência P50/P95, taxa de erro, throughput, status HTTP |
| **Seguranca** | `sprint2-seguranca` | Login success/failures, MFA, erro 401, latência auth, tabela eventos |
| **Financeiro** | `sprint3-financeiro` | PIX/min, falhas, volume BRL, latência, boletos |
| **Seguranca Avancada** | `sprint4-seguranca-avancada` | Dispositivos, atividades suspeitas, brute force, limites |
| **Incidentes** | `sprint5-incidentes` | CPU/Memória simulada, erros 5xx, incidentes ativos, latência |

Features visuais: thresholds verde/amarelo/vermelho, gradient fill, stat panels com background colorido, gauge panels, legend com cálculos (min/max/avg/last).

---

## Regras de Alerta

| Alerta | Condição | Severity | Sprint |
|--------|----------|----------|--------|
| Brute Force Detectado | >10 falhas login/min | critical | 2 |
| Timeout Autenticação | Latência auth >3s | warning | 2 |
| Falha PIX Elevada | >5 falhas PIX/min | critical | 3 |
| Latência Financeira | Latência >3s | warning | 3 |
| Brute Force Avançado | >15 tentativas/min | critical | 4 |
| Pico Atividade Suspeita | >5 ações suspeitas/2min | critical | 4 |
| Serviço DOWN | Incidentes ativos >0 por 30s | critical | 5 |
| Explosão Erros 5xx | >20 erros/min | critical | 5 |
| Latência Extrema | Latência >5s | critical | 5 |

---

## Estrutura do Projeto

```
.
├── docker-compose.yml
├── .github/workflows/ci.yml       # CI/CD (GitHub Actions)
├── README.md
├── PRD.md                          # Product Requirements Document
├── PROJECT_CONTEXT.md              # Contexto e regras do projeto
├── SPRINT_1.md → SPRINT_5.md       # Documentação das sprints
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts               # Entry point
│       ├── app.ts                  # Express setup
│       ├── modules/                # Feature modules
│       ├── middlewares/            # Logger, metrics
│       ├── metrics/                # Prometheus client
│       └── utils/                  # Pino logger
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx                 # Root + routing
│       └── components/            # 8 painéis React
├── grafana/
│   ├── dashboards/                 # 5 dashboards JSON
│   ├── datasources/               # Prometheus datasource
│   └── alerting/                   # 9 alert rules
└── prometheus/
    └── prometheus.yml              # Scrape config
```

---

## Roadmap

| Sprint | Tema | Status |
|--------|------|--------|
| 1 | Fundação (infra, health, Docker) | ✅ Concluída |
| 2 | Autenticação (login, MFA, logout) | ✅ Concluída |
| 3 | Financeiro (PIX, boleto, saldo) | ✅ Concluída |
| 4 | Segurança Avançada (fraude, dispositivos) | ✅ Concluída |
| 5 | Incidentes e Chaos Engineering | ✅ Concluída |
| 6 | Dashboards finais e documentação | ✅ Concluída |

---

## CI/CD

GitHub Actions configurado em `.github/workflows/ci.yml`:

- **Backend Build**: `npm ci` → `tsc` no Node 20
- **Frontend Build**: `npm ci` → `tsc && vite build` no Node 20
- **Docker Build**: build das imagens backend + frontend

Dispara em push e pull request na branch `main`.
