# Onde estão os endpoints e o incremento das metricas?

## Resumo visual

```
Requisição HTTP
  → Router (routes/*.ts)         ← define o caminho
    → Controller (*.controller.ts) ← incrementa métricas + chama logger
      → Service (*.service.ts)     ← lógica de negócio (fake, em memória)
        → Logger (*-logger.ts)     ← escreve log JSON no console
```

---

## Rotas (definicao dos endpoints)

| Módulo | Arquivo | Endpoints |
|--------|---------|-----------|
| Health | `backend/src/routes/health.routes.ts` | `GET /health` |
| Auth | `backend/src/modules/auth/routes/auth.routes.ts` | `POST /auth/login`, `/auth/mfa`, `/auth/logout` |
| Financeiro | `backend/src/modules/finance/routes/finance.routes.ts` | `GET /account/balance`, `POST /transactions/pix`, `POST /payments/boleto` |
| Seguranca | `backend/src/modules/security/routes/security.routes.ts` | `POST /devices/register`, `PUT /user/limits`, `POST /security/simulate/brute-force`, `POST /security/simulate/suspicious` |
| Incidentes | `backend/src/modules/incidents/routes/incidents.routes.ts` | `POST /incidents/service-down`, `/incidents/timeout`, `/incidents/internal-error`, `/incidents/overload`, `/incidents/recover`, `GET /incidents/active` |
| **Router central** | `backend/src/routes/index.ts` | Junta todos os modulos em `/api/v1` |

---

## Controllers (incremento das metricas)

Cada requisicao que chega passa por um controller. E dentro do controller que as metricas Prometheus sao incrementadas e os logs sao gerados.

| Módulo | Arquivo |
|--------|---------|
| Health | `backend/src/controllers/health.controller.ts` |
| Auth | `backend/src/modules/auth/controllers/auth.controller.ts` |
| Financeiro | `backend/src/modules/finance/controllers/finance.controller.ts` |
| Seguranca | `backend/src/modules/security/controllers/security.controller.ts` |
| Incidentes | `backend/src/modules/incidents/controllers/incidents.controller.ts` |

### Exemplo real (auth.controller.ts)

```typescript
export async function loginHandler(req: Request, res: Response): Promise<void> {
  // 1. Valida payload
  const validation = validateLogin(req.body);

  // 2. Executa logica de negocio (service)
  const result = await login(validation.data.username, validation.data.password);

  // 3. Incrementa metrica Prometheus (counter + histogram)
  loginSuccessTotal.inc();                     // ← INCREMENTO
  authRequestDurationSeconds.observe(...);     // ← INCREMENTO

  // 4. Gera log estruturado
  logSecurityEvent({                           // ← LOG
    event_type: 'LOGIN_SUCCESS',
    status_code: result.status,
    response_time: responseTime,
    ...
  });

  // 5. Retorna resposta HTTP
  res.status(result.status).json(result.body);
}
```

---

## Metricas Prometheus (definicao)

**Arquivo:** `backend/src/metrics/prometheus.ts`

Todas as 27 metricas customizadas sao definidas e exportadas aqui. Os controllers importam deste arquivo.

```typescript
// Exemplo de definicao de metrica
export const loginSuccessTotal = new client.Counter({
  name: 'login_success_total',
  help: 'Total number of successful logins',
});

export const authRequestDurationSeconds = new client.Histogram({
  name: 'auth_request_duration_seconds',
  help: 'Duration of authentication requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10],
});
```

**Metricas expostas em:** `GET http://localhost:3001/metrics`

---

## Logs Estruturados

Cada modulo tem seu proprio logger dedicado:

| Módulo | Arquivo |
|--------|---------|
| Auth | `backend/src/modules/auth/controllers/security-logger.ts` |
| Financeiro | `backend/src/modules/finance/controllers/finance-logger.ts` |
| Seguranca | `backend/src/modules/security/controllers/security-logger.ts` |
| Incidentes | `backend/src/modules/incidents/controllers/incidents-logger.ts` |

### Exemplo de log gerado

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

**Logger base:** `backend/src/utils/logger.ts` (configura o Pino com formato JSON)

---

## Estrutura completa de um modulo

Exemplo com o modulo `auth`. Os outros 3 (finance, security, incidents) seguem o mesmo padrao.

```
backend/src/modules/auth/
├── controllers/
│   ├── auth.controller.ts      ← incrementa metricas + chama logger
│   └── security-logger.ts      ← formata e escreve log JSON
├── services/
│   └── auth.service.ts         ← logica de negocio (fake, em memoria)
├── routes/
│   └── auth.routes.ts          ← define POST /login, /mfa, /logout
├── dto/
│   └── auth.dto.ts             ← interfaces de entrada (payload)
├── types/
│   └── auth.types.ts           ← tipos internos (respostas, eventos)
└── validators/
    └── auth.validator.ts       ← validacao de payload
```

---

## Servicos (logica de negocio)

A logica fake de cada modulo fica nos services. Tudo em memoria, sem banco de dados.

| Módulo | Arquivo |
|--------|---------|
| Health | `backend/src/services/health.service.ts` |
| Auth | `backend/src/modules/auth/services/auth.service.ts` |
| Financeiro | `backend/src/modules/finance/services/finance.service.ts` |
| Seguranca | `backend/src/modules/security/services/security.service.ts` |
| Incidentes | `backend/src/modules/incidents/services/incidents.service.ts` |

---

## Validators (validacao de payload)

Cada modulo valida o payload de entrada antes de processar.

| Módulo | Arquivo |
|--------|---------|
| Auth | `backend/src/modules/auth/validators/auth.validator.ts` |
| Financeiro | `backend/src/modules/finance/validators/finance.validator.ts` |
| Seguranca | `backend/src/modules/security/validators/security.validator.ts` |
| Incidentes | `backend/src/modules/incidents/validators/incidents.validator.ts` |

---

## Middlewares globais

Executam em **toda** requisicao, antes dos controllers.

| Middleware | Arquivo | Funcao |
|------------|---------|--------|
| Logger HTTP | `backend/src/middlewares/logger.middleware.ts` | Loga metodo, endpoint, status e response_time de toda requisicao |
| Metricas HTTP | `backend/src/middlewares/metrics.middleware.ts` | Incrementa `http_requests_total` e `http_request_duration_seconds` em toda requisicao |

---

## Mapa completo de arquivos do backend

```
backend/src/
├── app.ts                             ← Configuracao Express (cors, json, middlewares, rotas, /metrics)
├── server.ts                          ← Entry point (listen na porta 3001)
├── controllers/
│   └── health.controller.ts
├── services/
│   └── health.service.ts
├── routes/
│   ├── index.ts                       ← Roteador central (/api/v1)
│   └── health.routes.ts
├── middlewares/
│   ├── logger.middleware.ts
│   └── metrics.middleware.ts
├── metrics/
│   └── prometheus.ts                  ← 27 metricas customizadas
├── utils/
│   └── logger.ts                      ← Configuracao Pino
└── modules/
    ├── auth/                          ← Sprint 2
    ├── finance/                       ← Sprint 3
    ├── security/                      ← Sprint 4
    └── incidents/                     ← Sprint 5
```

---

## Frontend

| Componente | Arquivo | Funcao |
|------------|---------|--------|
| App | `frontend/src/App.tsx` | Root, navegacao entre paginas |
| Sidebar | `frontend/src/components/Sidebar.tsx` | Menu lateral com icones SVG |
| Header | `frontend/src/components/Header.tsx` | Breadcrumb + relogio |
| Dashboard | `frontend/src/components/MainPanel.tsx` | Metricas ao vivo + sprints |
| AuthPanel | `frontend/src/components/AuthPanel.tsx` | Botoes de autenticacao |
| FinancePanel | `frontend/src/components/FinancePanel.tsx` | Botoes de operacoes financeiras |
| SecurityPanel | `frontend/src/components/SecurityPanel.tsx` | Botoes de seguranca avancada |
| IncidentPanel | `frontend/src/components/IncidentPanel.tsx` | Botoes de incidentes + status |
| LogPanel | `frontend/src/components/LogPanel.tsx` | Lista de ultimos eventos |
| Icon | `frontend/src/components/Icon.tsx` | Icones SVG inline (Feather) |
