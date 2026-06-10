# SPRINT 03 — Operações Financeiras

# Objetivo

Implementar as operações financeiras simuladas do Internet Banking, incluindo PIX, consulta de saldo e pagamento de boletos, juntamente com métricas, logs estruturados e dashboards financeiros.

---

# Visão Geral

A Sprint 3 introduz os principais fluxos bancários do sistema.

Todos os endpoints devem:

* gerar logs estruturados;
* exportar métricas Prometheus;
* permitir simulações de sucesso e falha;
* suportar simulação de latência;
* manter arquitetura modular.

---

# Backend

# Tarefa 1 — Estrutura do Módulo Financeiro

## Estrutura esperada

```txt id="3ncvje"
src/modules/finance/
├── controllers/
├── services/
├── routes/
├── dto/
├── validators/
└── types/
```

---

# Tarefa 2 — Consulta de Saldo

## Endpoint

```txt id="g0i83j"
GET /api/v1/account/balance
```

---

## Cenários obrigatórios

### Sucesso

Status:

```txt id="vgb60i"
200 OK
```

Resposta:

```json id="mxk8u0"
{
  "balance": 5234.87,
  "currency": "BRL"
}
```

---

### Lentidão simulada

Objetivo:
Simular demora de banco de dados.

Comportamento:

* delay artificial de 3–5 segundos.

---

# Tarefa 3 — PIX

## Endpoint

```txt id="45xtqx"
POST /api/v1/transactions/pix
```

---

## Cenários obrigatórios

### PIX sucesso

Status:

```txt id="z7q0em"
201 Created
```

### Saldo insuficiente

Status:

```txt id="c05jya"
422 Unprocessable Entity
```

### Timeout BACEN

Status:

```txt id="y5j7rv"
503 Service Unavailable
```

### Latência elevada

Delay artificial:

```txt id="t91u54"
5 segundos
```

---

## Payload esperado

```json id="4qq2ps"
{
  "fromAccount": "123",
  "toAccount": "456",
  "amount": 250.00
}
```

---

# Tarefa 4 — Pagamento de Boleto

## Endpoint

```txt id="ew31eq"
POST /api/v1/payments/boleto
```

---

## Cenários obrigatórios

### Sucesso

Status:

```txt id="jx81cz"
200 OK
```

### Boleto inválido

Status:

```txt id="jxy3kl"
400 Bad Request
```

### Boleto vencido

Status:

```txt id="m5ahoq"
422 Unprocessable Entity
```

---

# Tarefa 5 — Logs Financeiros

## Campos obrigatórios

```json id="50htqe"
{
  "timestamp": "",
  "event_type": "PIX_SUCCESS",
  "transaction_id": "",
  "amount": 250,
  "status_code": 201,
  "response_time": 120,
  "user_id": ""
}
```

---

## Eventos obrigatórios

* PIX_SUCCESS
* PIX_FAILURE
* PIX_TIMEOUT
* BALANCE_REQUEST
* BOLETO_SUCCESS
* BOLETO_FAILURE

---

# Tarefa 6 — Métricas Financeiras

## Counters

```txt id="9t5b1l"
pix_transactions_total
pix_failures_total
pix_timeout_total
boleto_payments_total
boleto_failures_total
```

---

## Histograms

```txt id="wjlwmm"
finance_request_duration_seconds
```

---

## Gauge

```txt id="y9jxha"
transaction_volume_total
```

---

# Frontend

# Tarefa 7 — Painel Financeiro

## Botões obrigatórios

* Consultar saldo
* PIX sucesso
* PIX sem saldo
* PIX timeout
* Simular latência
* Pagar boleto
* Boleto inválido

---

## Feedback visual

Mostrar:

* status HTTP;
* tempo de resposta;
* valor transacionado;
* mensagens de erro.

---

# Observabilidade

# Tarefa 8 — Dashboard Financeiro

## Painéis obrigatórios

* PIX/min
* Falhas PIX
* Volume transacionado
* Latência média
* Taxa de erro
* Boleto failures

---

# Tarefa 9 — Alertas

## Alertas obrigatórios

### Falha PIX elevada

```txt id="n19yzs"
Mais de 5 falhas PIX em 1 minuto
```

### Latência crítica

```txt id="wd3kqj"
Tempo médio > 3 segundos
```

---

# Critérios de Aceite Final

* Todos endpoints funcionando;
* Métricas exportadas;
* Logs estruturados;
* Dashboard financeiro operacional;
* Alertas funcionando.
