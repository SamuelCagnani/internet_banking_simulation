# PRD — Simulador de Internet Banking para Observabilidade

## 1. Visão Geral

### Nome do Projeto

Internet Banking Observability Simulator

### Objetivo

Desenvolver uma aplicação simuladora de Internet Banking capaz de gerar operações financeiras, eventos de autenticação e incidentes controlados para demonstração prática de observabilidade utilizando métricas, logs e dashboards.

### Problema

Projetos de monitoramento e observabilidade frequentemente carecem de aplicações realistas para geração de dados operacionais. O sistema proposto permite simular cenários próximos de ambientes bancários reais, incluindo falhas, latência elevada, erros de autenticação e transações financeiras.

### Público-Alvo

* Estudantes
* Desenvolvedores
* DevOps Engineers
* SRE Engineers
* Analistas de Segurança
* Equipes de Observabilidade

---

# 2. Objetivos do Produto

## Objetivos Funcionais

* Simular operações de internet banking.
* Gerar métricas para Prometheus.
* Gerar dashboards Grafana.
* Produzir logs estruturados.
* Simular incidentes operacionais.

## Objetivos Técnicos

* Arquitetura modular.
* APIs RESTful.
* Métricas em tempo real.
* Logs estruturados JSON.
* Ambiente containerizado.
* Fácil expansão futura.

---

# 3. Escopo do Produto

## Incluído

* Login
* MFA
* PIX
* Pagamento de boleto
* Consulta de saldo
* Registro de dispositivos
* Alteração de limite PIX
* Healthcheck
* Simulação de incidentes

## Não Incluído

* Banco de dados real
* Integração BACEN real
* Processamento financeiro real
* Autenticação real
* Segurança bancária real

---

# 4. Arquitetura

## Frontend

Tecnologias:

* React
* Vite
* TailwindCSS
* Axios

Responsabilidades:

* Interface de simulação
* Disparo de eventos
* Painel de incidentes

## Backend

Tecnologias:

* Node.js
* Express
* TypeScript

Responsabilidades:

* Simulação de APIs
* Geração de métricas
* Geração de logs
* Simulação de latência
* Simulação de falhas

## Observabilidade

Tecnologias:

* Prometheus
* Grafana

---

# 5. Endpoints Principais

## Autenticação

### POST /api/v1/auth/login

Cenários:

* Sucesso
* Senha inválida
* Timeout

### POST /api/v1/auth/mfa

Cenários:

* Token válido
* Token inválido

### POST /api/v1/auth/logout

Cenários:

* Logout bem-sucedido

---

## Operações Financeiras

### GET /api/v1/account/balance

Cenários:

* Resposta rápida
* Resposta lenta

### POST /api/v1/transactions/pix

Cenários:

* Sucesso
* Saldo insuficiente
* Timeout BACEN
* Erro 503

### POST /api/v1/payments/boleto

Cenários:

* Sucesso
* Boleto inválido

---

## Segurança e Fraude

### POST /api/v1/devices/register

Cenários:

* Registro de dispositivo

### PUT /api/v1/user/limits

Cenários:

* Alteração de limite

---

## Infraestrutura

### GET /api/v1/health

Cenários:

* UP
* DOWN

---

# 6. Observabilidade

## Logs Estruturados

Formato:

```json
{
  "timestamp": "",
  "endpoint": "",
  "status_code": 200,
  "response_time": 120,
  "user_id": "",
  "event_type": ""
}
```

## Métricas

### HTTP

* http_requests_total
* http_request_duration_seconds
* http_errors_total

### Segurança

* login_failures_total
* mfa_failures_total

### Financeiro

* pix_transactions_total
* pix_failures_total
* transaction_volume_total

### Infraestrutura

* service_health_status
* simulated_cpu_usage
* simulated_memory_usage

---

# 7. Dashboards Grafana

## Dashboard Infraestrutura

* CPU
* Memória
* Latência
* Throughput

## Dashboard Aplicação

* Requests por minuto
* Taxa de erro
* Endpoints mais utilizados

## Dashboard Segurança

* Falhas de login
* Tentativas MFA inválidas
* Suspeita de brute force

## Dashboard Financeiro

* PIX por minuto
* Falhas PIX
* Volume financeiro

## Dashboard Incidentes

* Serviços DOWN
* Alertas ativos
* Latência elevada

---

# 8. Simulações de Incidentes

## Incidentes previstos

* Timeout
* Erro 500
* Erro 503
* Lentidão artificial
* Falha de autenticação
* Pico de tráfego
* Queda de serviço

---

# 9. Requisitos Não Funcionais

* APIs RESTful
* Tempo médio de resposta < 2s
* Logs JSON estruturados
* Compatibilidade Prometheus
* Docker Compose obrigatório
* Código modular
* Arquitetura em camadas
* TypeScript obrigatório

---

# 10. Critérios de Aceite

* Dashboards atualizando em tempo real
* Métricas exportadas corretamente
* Logs estruturados gerados
* Endpoints funcionais
* Simulações acionáveis via interface
* Ambiente executável via Docker Compose

---

# 11. Roadmap

## Sprint 1

Infraestrutura base.

## Sprint 2

Autenticação.

## Sprint 3

PIX e operações financeiras.

## Sprint 4

Fraude e segurança.

## Sprint 5

Incidentes e caos controlado.

## Sprint 6

Dashboards finais e documentação.
