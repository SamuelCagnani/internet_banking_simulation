# Onde estao os endpoints e o incremento das metricas?

## Resumo visual

```
Requisicao HTTP
  → Router (routes/*.ts)             ← define o caminho
    → Controller (*.controller.ts)   ← incrementa metricas + gera log
      → Service (*.service.ts)       ← logica de negocio (fake, em memoria)
        → Logger (*-logger.ts)       ← escreve log JSON no console
```

---

## Endpoints — definicao das rotas

Cada rota associa um verbo HTTP + caminho a um handler do controller.

| # | Metodo | Endpoint | Arquivo:linha |
|---|--------|----------|---------------|
| 1 | GET | `/api/v1/health` | `routes/health.routes.ts:6` |
| 2 | POST | `/api/v1/auth/login` | `modules/auth/routes/auth.routes.ts:6` |
| 3 | POST | `/api/v1/auth/mfa` | `modules/auth/routes/auth.routes.ts:7` |
| 4 | POST | `/api/v1/auth/logout` | `modules/auth/routes/auth.routes.ts:8` |
| 5 | GET | `/api/v1/account/balance` | `modules/finance/routes/finance.routes.ts:6` |
| 6 | POST | `/api/v1/transactions/pix` | `modules/finance/routes/finance.routes.ts:7` |
| 7 | POST | `/api/v1/payments/boleto` | `modules/finance/routes/finance.routes.ts:8` |
| 8 | POST | `/api/v1/devices/register` | `modules/security/routes/security.routes.ts:11` |
| 9 | PUT | `/api/v1/user/limits` | `modules/security/routes/security.routes.ts:12` |
| 10 | POST | `/api/v1/security/simulate/brute-force` | `modules/security/routes/security.routes.ts:13` |
| 11 | POST | `/api/v1/security/simulate/suspicious` | `modules/security/routes/security.routes.ts:14` |
| 12 | POST | `/api/v1/incidents/service-down` | `modules/incidents/routes/incidents.routes.ts:13` |
| 13 | POST | `/api/v1/incidents/timeout` | `modules/incidents/routes/incidents.routes.ts:14` |
| 14 | POST | `/api/v1/incidents/internal-error` | `modules/incidents/routes/incidents.routes.ts:15` |
| 15 | POST | `/api/v1/incidents/overload` | `modules/incidents/routes/incidents.routes.ts:16` |
| 16 | POST | `/api/v1/incidents/recover` | `modules/incidents/routes/incidents.routes.ts:17` |
| 17 | GET | `/api/v1/incidents/active` | `modules/incidents/routes/incidents.routes.ts:18` |
| 18 | GET | `/metrics` (Prometheus) | `app.ts:19` |

**Router central:** `routes/index.ts:8-14` — junta todos os modulos sob `/api/v1`

---

## Incremento das metricas — controllers

Cada requisicao dispara incrementos de metricas e geracao de logs dentro do controller. Abaixo, exatamente onde cada metrica e log sao disparados.

### Modulo Auth

**Arquivo:** `modules/auth/controllers/auth.controller.ts`

| Linha | Acao | Detalhe |
|-------|------|---------|
| 28-31 | `authRequestDurationSeconds.observe()` | Histograma de latencia de login |
| 34 | `loginSuccessTotal.inc()` | **INCREMENTO** — login bem-sucedido |
| 35-43 | `logSecurityEvent()` | **LOG** — `LOGIN_SUCCESS` |
| 45 | `loginFailuresTotal.inc()` | **INCREMENTO** — login falho |
| 46-54 | `logSecurityEvent()` | **LOG** — `LOGIN_FAILURE` |
| 56 | `authTimeoutTotal.inc()` | **INCREMENTO** — timeout de auth |
| 57-65 | `logSecurityEvent()` | **LOG** — `AUTH_TIMEOUT` |
| 85-88 | `authRequestDurationSeconds.observe()` | Histograma de latencia de MFA |
| 91 | `mfaSuccessTotal.inc()` | **INCREMENTO** — MFA valido |
| 92-100 | `logSecurityEvent()` | **LOG** — `MFA_SUCCESS` |
| 102 | `mfaFailuresTotal.inc()` | **INCREMENTO** — MFA invalido |
| 103-111 | `logSecurityEvent()` | **LOG** — `MFA_FAILURE` |
| 125-128 | `authRequestDurationSeconds.observe()` | Histograma de latencia de logout |
| 130-138 | `logSecurityEvent()` | **LOG** — `LOGOUT_SUCCESS` |

**Logger de auth:** `modules/auth/controllers/security-logger.ts:4-14`

---

### Modulo Financeiro

**Arquivo:** `modules/finance/controllers/finance.controller.ts`

| Linha | Acao | Detalhe |
|-------|------|---------|
| 23-26 | `financeRequestDurationSeconds.observe()` | Histograma de latencia |
| 28-36 | `logFinanceEvent()` | **LOG** — `BALANCE_REQUEST` |
| 57-60 | `financeRequestDurationSeconds.observe()` | Histograma de latencia |
| 62 | `transactionVolumeTotal.set()` | **GAUGE** — volume da transacao |
| 65 | `pixTransactionsTotal.inc()` | **INCREMENTO** — PIX sucesso |
| 66-75 | `logFinanceEvent()` | **LOG** — `PIX_SUCCESS` |
| 77 | `pixTimeoutTotal.inc()` | **INCREMENTO** — PIX timeout |
| 78-87 | `logFinanceEvent()` | **LOG** — `PIX_TIMEOUT` |
| 89 | `pixFailuresTotal.inc()` | **INCREMENTO** — PIX falha |
| 90-99 | `logFinanceEvent()` | **LOG** — `PIX_FAILURE` |
| 120-123 | `financeRequestDurationSeconds.observe()` | Histograma de latencia |
| 126 | `boletoPaymentsTotal.inc()` | **INCREMENTO** — boleto pago |
| 127-136 | `logFinanceEvent()` | **LOG** — `BOLETO_SUCCESS` |
| 138 | `boletoFailuresTotal.inc()` | **INCREMENTO** — boleto falhou |
| 139-148 | `logFinanceEvent()` | **LOG** — `BOLETO_FAILURE` |

**Logger de financeiro:** `modules/finance/controllers/finance-logger.ts:4-15`

---

### Modulo Seguranca

**Arquivo:** `modules/security/controllers/security.controller.ts`

| Linha | Acao | Detalhe |
|-------|------|---------|
| 25-29 | `updateGauges()` | **GAUGES** — atualiza CPU, memoria, incidents ativos |
| 40-43 | `securityRequestDurationSeconds.observe()` | Histograma de latencia |
| 45 | `deviceRegistrationsTotal.inc()` | **INCREMENTO** — dispositivo registrado |
| 46-55 | `logAuditEvent()` | **LOG** — `DEVICE_REGISTERED` |
| 57 | `suspiciousActionsTotal.inc()` | **INCREMENTO** — acao suspeita |
| 58-67 | `logAuditEvent()` | **LOG** — `DEVICE_BLOCKED` |
| 87-90 | `securityRequestDurationSeconds.observe()` | Histograma de latencia |
| 92 | `limitChangesTotal.inc()` | **INCREMENTO** — limite alterado |
| 93-102 | `logAuditEvent()` | **LOG** — `LIMIT_CHANGED` |
| 104 | `suspiciousActionsTotal.inc()` | **INCREMENTO** — limite bloqueado (429) |
| 105-114 | `logAuditEvent()` | **LOG** — `LIMIT_CHANGED` (bloqueado) |
| 133-136 | `securityRequestDurationSeconds.observe()` | Histograma de latencia |
| 138 | `bruteForceAttemptsTotal.inc()` | **INCREMENTO** — tentativas de brute force |
| 139 | `suspiciousActionsTotal.inc()` | **INCREMENTO** — acao suspeita |
| 141-150 | `logAuditEvent()` | **LOG** — `BRUTE_FORCE_DETECTED` |
| 163-166 | `securityRequestDurationSeconds.observe()` | Histograma de latencia |
| 168 | `suspiciousActionsTotal.inc()` | **INCREMENTO** — acao suspeita |
| 170-179 | `logAuditEvent()` | **LOG** — `SUSPICIOUS_ACTIVITY` |

**Logger de seguranca:** `modules/security/controllers/security-logger.ts:4-12`

---

### Modulo Incidentes

**Arquivo:** `modules/incidents/controllers/incidents.controller.ts`

| Linha | Acao | Detalhe |
|-------|------|---------|
| 25-29 | `updateGauges()` | **GAUGES** — `simulatedCpuUsage.set()`, `simulatedMemoryUsage.set()`, `activeIncidentsGauge.set()` |
| 40-43 | `incidentRequestDurationSeconds.observe()` | Histograma de latencia |
| 44 | `incidentsTotal.inc()` | **INCREMENTO** — incidente total |
| 45 | `serviceDownTotal.inc()` | **INCREMENTO** — queda de servico |
| 46 | `updateGauges()` | **GAUGES** — atualiza estado |
| 48-57 | `logIncidentEvent()` | **LOG** — `SERVICE_DOWN` |
| 71-74 | `incidentRequestDurationSeconds.observe()` | Histograma de latencia |
| 75 | `incidentsTotal.inc()` | **INCREMENTO** — incidente total |
| 76 | `timeoutEventsTotal.inc()` | **INCREMENTO** — timeout |
| 77 | `updateGauges()` | **GAUGES** — atualiza estado |
| 79-88 | `logIncidentEvent()` | **LOG** — `TIMEOUT_EVENT` |
| 101-104 | `incidentRequestDurationSeconds.observe()` | Histograma de latencia |
| 105 | `incidentsTotal.inc()` | **INCREMENTO** — incidente total |
| 106 | `internalErrorsTotal.inc()` | **INCREMENTO** — erro interno |
| 107 | `updateGauges()` | **GAUGES** — atualiza estado |
| 109-118 | `logIncidentEvent()` | **LOG** — `INTERNAL_ERROR` |
| 131-134 | `incidentRequestDurationSeconds.observe()` | Histograma de latencia |
| 135 | `incidentsTotal.inc()` | **INCREMENTO** — incidente total |
| 136 | `overloadEventsTotal.inc()` | **INCREMENTO** — sobrecarga |
| 137 | `updateGauges()` | **GAUGES** — atualiza estado |
| 139-148 | `logIncidentEvent()` | **LOG** — `OVERLOAD_DETECTED` |
| 161-164 | `incidentRequestDurationSeconds.observe()` | Histograma de latencia |
| 165 | `updateGauges()` | **GAUGES** — reseta estado |
| 167-176 | `logIncidentEvent()` | **LOG** — `HEALTHCHECK_FAILED` |

**Logger de incidentes:** `modules/incidents/controllers/incidents-logger.ts:4-14`

---

## Metricas Prometheus — definicao

**Arquivo:** `metrics/prometheus.ts` — todas as 27 metricas sao definidas e exportadas aqui.

| Linha | Metrica | Tipo |
|-------|---------|------|
| 7 | `http_requests_total` | Counter |
| 13 | `http_request_duration_seconds` | Histogram |
| 20 | `http_errors_total` | Counter |
| 26 | `login_success_total` | Counter |
| 31 | `login_failures_total` | Counter |
| 36 | `mfa_success_total` | Counter |
| 41 | `mfa_failures_total` | Counter |
| 46 | `auth_timeout_total` | Counter |
| 51 | `auth_request_duration_seconds` | Histogram |
| 58 | `pix_transactions_total` | Counter |
| 63 | `pix_failures_total` | Counter |
| 68 | `pix_timeout_total` | Counter |
| 73 | `boleto_payments_total` | Counter |
| 78 | `boleto_failures_total` | Counter |
| 83 | `finance_request_duration_seconds` | Histogram |
| 90 | `transaction_volume_total` | Gauge |
| 95 | `device_registrations_total` | Counter |
| 100 | `suspicious_actions_total` | Counter |
| 105 | `limit_changes_total` | Counter |
| 110 | `brute_force_attempts_total` | Counter |
| 115 | `security_request_duration_seconds` | Histogram |
| 122 | `incidents_total` | Counter |
| 127 | `service_down_total` | Counter |
| 132 | `timeout_events_total` | Counter |
| 137 | `internal_errors_total` | Counter |
| 142 | `overload_events_total` | Counter |
| 147 | `simulated_cpu_usage` | Gauge |
| 152 | `simulated_memory_usage` | Gauge |
| 157 | `active_incidents_total` | Gauge |
| 162 | `incident_request_duration_seconds` | Histogram |

**Expostas em:** `GET http://localhost:3001/metrics` via `app.ts:19-22`

---

## Logs estruturados — logger por modulo

Cada modulo tem seu proprio logger:

| Logger | Arquivo | Eventos gerados |
|--------|---------|-----------------|
| Auth | `security-logger.ts:4-14` | `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `MFA_SUCCESS`, `MFA_FAILURE`, `LOGOUT_SUCCESS`, `AUTH_TIMEOUT` |
| Financeiro | `finance-logger.ts:4-15` | `PIX_SUCCESS`, `PIX_FAILURE`, `PIX_TIMEOUT`, `BALANCE_REQUEST`, `BOLETO_SUCCESS`, `BOLETO_FAILURE` |
| Seguranca | `security-logger.ts:4-12` | `DEVICE_REGISTERED`, `DEVICE_BLOCKED`, `LIMIT_CHANGED`, `SUSPICIOUS_ACTIVITY`, `BRUTE_FORCE_DETECTED` |
| Incidentes | `incidents-logger.ts:4-14` | `SERVICE_DOWN`, `TIMEOUT_EVENT`, `INTERNAL_ERROR`, `OVERLOAD_DETECTED`, `HEALTHCHECK_FAILED` |

**Logger base (Pino):** `utils/logger.ts` — configura formato JSON

---

## Servicos — logica de negocio

| Modulo | Arquivo | Funcoes |
|--------|---------|---------|
| Health | `services/health.service.ts:1-17` | `getHealthStatus()`, `setServiceDown()`, `isServiceDown()` |
| Auth | `auth/services/auth.service.ts:12-94` | `login()`, `verifyMfa()`, `logout()` |
| Financeiro | `finance/services/finance.service.ts:20-172` | `getBalance()`, `processPix()`, `processBoleto()` |
| Seguranca | `security/services/security.service.ts:14-146` | `registerDevice()`, `changeLimit()`, `simulateBruteForce()`, `simulateSuspiciousActivity()` |
| Incidentes | `incidents/services/incidents.service.ts:37-157` | `triggerServiceDown()`, `triggerTimeout()`, `triggerInternalError()`, `triggerOverload()`, `recoverSystem()` |

---

## Middlewares globais

Executam em **toda** requisicao, antes dos controllers.

| Middleware | Arquivo | O que faz |
|------------|---------|-----------|
| Logger HTTP | `middlewares/logger.middleware.ts` | Loga metodo, endpoint, status e response_time de toda requisicao |
| Metricas HTTP | `middlewares/metrics.middleware.ts` | Incrementa `http_requests_total` e `http_request_duration_seconds` em toda requisicao |

---

## Mapa completo do backend (com linhas dos entry points)

```
backend/src/
├── app.ts                              ← L:19 /metrics, L:17 rotas, L:11-15 middlewares
├── server.ts                           ← L:6 app.listen(3001)
├── controllers/health.controller.ts    ← L:4-8 healthCheck()
├── services/health.service.ts          ← L:1-17 getHealthStatus(), setServiceDown()
├── routes/
│   ├── index.ts                        ← L:8-14 junta todos os modulos
│   └── health.routes.ts               ← L:6 GET /health
├── middlewares/
│   ├── logger.middleware.ts            ← loga toda request
│   └── metrics.middleware.ts           ← incrementa http_requests_total
├── metrics/prometheus.ts              ← L:7-162 27 metricas definidas
├── utils/logger.ts                     ← configuracao Pino
└── modules/
    ├── auth/                           ← Sprint 2 (6 arquivos)
    │   ├── controllers/auth.controller.ts    ← L:14-141 incrementos + logs
    │   └── controllers/security-logger.ts    ← L:4-14 escreve log
    ├── finance/                        ← Sprint 3 (6 arquivos)
    │   ├── controllers/finance.controller.ts ← L:15-152 incrementos + logs
    │   └── controllers/finance-logger.ts     ← L:4-15 escreve log
    ├── security/                       ← Sprint 4 (6 arquivos)
    │   ├── controllers/security.controller.ts ← L:31-179 incrementos + logs
    │   └── controllers/security-logger.ts    ← L:4-12 escreve log
    └── incidents/                      ← Sprint 5 (7 arquivos)
        ├── controllers/incidents.controller.ts ← L:31-173 incrementos + logs + gauges
        └── controllers/incidents-logger.ts    ← L:4-14 escreve log
```

---

## Frontend

| Componente | Arquivo | O que faz |
|------------|---------|-----------|
| App | `frontend/src/App.tsx` | Root, navegacao entre paginas |
| Sidebar | `frontend/src/components/Sidebar.tsx` | Menu lateral com icones SVG |
| Header | `frontend/src/components/Header.tsx` | Breadcrumb + relogio ao vivo |
| Dashboard | `frontend/src/components/MainPanel.tsx` | Metricas ao vivo + sprints |
| AuthPanel | `frontend/src/components/AuthPanel.tsx` | Botoes de autenticacao |
| FinancePanel | `frontend/src/components/FinancePanel.tsx` | Botoes de operacoes financeiras |
| SecurityPanel | `frontend/src/components/SecurityPanel.tsx` | Botoes de seguranca avancada |
| IncidentPanel | `frontend/src/components/IncidentPanel.tsx` | Botoes de incidentes + status |
| LogPanel | `frontend/src/components/LogPanel.tsx` | Lista de ultimos eventos |
| Icon | `frontend/src/components/Icon.tsx` | Icones SVG inline (Feather) |
