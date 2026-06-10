# SPRINT 01 — Fundação da Infraestrutura

# Objetivo

Criar a infraestrutura inicial do sistema, incluindo backend, frontend e stack básica de observabilidade.

---

# Backend

## Tarefa 1 — Inicialização do Projeto

### Objetivo

Criar projeto Node.js com TypeScript.

### Requisitos

* Node.js
* Express
* TypeScript
* ts-node-dev

### Critérios de Aceite

* Projeto inicia com `npm run dev`
* TypeScript funcionando

---

## Tarefa 2 — Estrutura Modular

### Estrutura esperada

```txt
src/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── metrics/
├── utils/
└── app.ts
```

### Critérios de Aceite

* Estrutura criada
* Imports funcionando

---

## Tarefa 3 — Middleware de Logs

### Objetivo

Criar logs estruturados JSON.

### Requisitos

* Winston ou Pino
* Logs de request
* Logs de erro

### Campos obrigatórios

```json
{
  "timestamp": "",
  "method": "",
  "endpoint": "",
  "status_code": 200,
  "response_time": 120
}
```

### Critérios de Aceite

* Logs aparecem no terminal
* Formato JSON válido

---

## Tarefa 4 — Métricas Prometheus

### Objetivo

Adicionar métricas HTTP.

### Requisitos

* prom-client
* contador de requests
* histograma de latência

### Métricas obrigatórias

* http_requests_total
* http_request_duration_seconds

### Critérios de Aceite

* Endpoint `/metrics` funcionando
* Prometheus consegue coletar

---

## Tarefa 5 — Endpoint Healthcheck

### Endpoint

```txt
GET /api/v1/health
```

### Respostas esperadas

#### Sucesso

```json
{
  "status": "UP"
}
```

#### Falha simulada

```json
{
  "status": "DOWN"
}
```

### Critérios de Aceite

* Endpoint responde corretamente
* Métricas geradas

---

# Frontend

## Tarefa 6 — Inicialização React

### Requisitos

* Vite
* React
* TailwindCSS
* Axios

### Critérios de Aceite

* Frontend inicia corretamente

---

## Tarefa 7 — Layout Inicial

### Componentes

* Sidebar
* Header
* Área principal
* Painel de botões

### Critérios de Aceite

* Layout responsivo
* Navegação funcional

---

# Observabilidade

## Tarefa 8 — Docker Compose

### Serviços

* frontend
* backend
* prometheus
* grafana

### Critérios de Aceite

* Todos serviços sobem
* Containers comunicando

---

## Tarefa 9 — Prometheus

### Objetivo

Coletar métricas backend.

### Critérios de Aceite

* Target UP
* Métricas visíveis

---

## Tarefa 10 — Grafana

### Objetivo

Criar dashboard inicial.

### Painéis mínimos

* Requests por minuto
* Latência média
* Taxa de erro

### Critérios de Aceite

* Dashboard funcionando
