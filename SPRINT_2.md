# SPRINT 02 — Autenticação e Segurança

# Objetivo

Implementar os fluxos de autenticação simulados do Internet Banking, incluindo login, MFA, logout, métricas de segurança e logs estruturados para observabilidade.

---

# Visão Geral

A Sprint 2 será responsável por introduzir os primeiros fluxos críticos de segurança do sistema bancário.

Todos os endpoints devem:

* gerar logs estruturados;
* gerar métricas Prometheus;
* possuir tratamento de erro;
* permitir simulações de sucesso e falha;
* ser totalmente simulados (sem autenticação real).

---

# Backend

# Tarefa 1 — Estrutura do Módulo Auth

## Objetivo

Criar o módulo responsável pelas operações de autenticação.

## Estrutura esperada

```txt id="n0wqqx"
src/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── dto/
│   │   ├── types/
│   │   └── validators/
```

## Critérios de Aceite

* Estrutura modular criada
* Imports organizados
* Separação clara de responsabilidades

---

# Tarefa 2 — Endpoint Login

## Endpoint

```txt id="1ck9eb"
POST /api/v1/auth/login
```

---

## Objetivo

Simular autenticação de usuário.

---

## Cenários obrigatórios

### Login com sucesso

Resposta:

```json id="3rvjcl"
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "fake-jwt-token"
}
```

Status:

```txt id="k5q9v5"
200 OK
```

---

### Senha inválida

Resposta:

```json id="dzznfu"
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

Status:

```txt id="u31uxw"
401 Unauthorized
```

---

### Timeout simulado

Objetivo:
Simular lentidão do sistema de autenticação.

Comportamento:

* delay artificial de 3–5 segundos
* resposta 504 ou 503

---

## Payload esperado

```json id="2yowcu"
{
  "username": "admin",
  "password": "123456"
}
```

---

## Regras

* Não implementar JWT real.
* Não usar banco de dados.
* Usuários fake em memória.

---

## Critérios de Aceite

* Endpoint funcionando
* Cenários simulados funcionando
* Logs gerados
* Métricas registradas

---

# Tarefa 3 — Endpoint MFA

## Endpoint

```txt id="jlwmz0"
POST /api/v1/auth/mfa
```

---

## Objetivo

Simular segundo fator de autenticação.

---

## Cenários obrigatórios

### Token válido

Status:

```txt id="c78v2m"
200 OK
```

### Token inválido

Status:

```txt id="8tq0p1"
401 Unauthorized
```

### Token expirado

Status:

```txt id="5fd0a6"
403 Forbidden
```

---

## Payload esperado

```json id="cl3fjv"
{
  "code": "123456"
}
```

---

## Critérios de Aceite

* MFA funcionando
* Simulações válidas
* Logs estruturados gerados

---

# Tarefa 4 — Endpoint Logout

## Endpoint

```txt id="v4u7yi"
POST /api/v1/auth/logout
```

---

## Objetivo

Simular encerramento de sessão.

---

## Resposta esperada

```json id="7cjlwm"
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## Critérios de Aceite

* Endpoint funcional
* Logs gerados
* Métricas incrementadas

---

# Tarefa 5 — Logs Estruturados de Segurança

## Objetivo

Criar logs específicos para autenticação.

---

## Campos obrigatórios

```json id="f83o6k"
{
  "timestamp": "",
  "event_type": "LOGIN_FAILURE",
  "user_id": "123",
  "ip_address": "127.0.0.1",
  "endpoint": "/api/v1/auth/login",
  "status_code": 401,
  "response_time": 231,
  "user_agent": ""
}
```

---

## Eventos obrigatórios

* LOGIN_SUCCESS
* LOGIN_FAILURE
* MFA_SUCCESS
* MFA_FAILURE
* LOGOUT_SUCCESS
* AUTH_TIMEOUT

---

## Critérios de Aceite

* Logs JSON válidos
* Eventos categorizados
* Logs legíveis no terminal

---

# Tarefa 6 — Métricas Prometheus

## Objetivo

Adicionar métricas específicas de autenticação.

---

## Métricas obrigatórias

### Counters

```txt id="jlwm89"
login_success_total
login_failures_total
mfa_success_total
mfa_failures_total
auth_timeout_total
```

---

### Histogram

```txt id="n8x07l"
auth_request_duration_seconds
```

---

## Labels obrigatórias

```txt id="4n6v0l"
method
endpoint
status_code
```

---

## Critérios de Aceite

* Métricas exportadas
* Labels funcionando
* Dados visíveis no Prometheus

---

# Frontend

# Tarefa 7 — Painel de Autenticação

## Objetivo

Criar interface para disparar eventos de autenticação.

---

## Componentes esperados

### Botões

* Login Sucesso
* Login Falho
* MFA Válido
* MFA Inválido
* Logout
* Simular Timeout

---

## Comportamento

Cada botão deve:

* chamar o endpoint correspondente;
* exibir status da requisição;
* exibir tempo de resposta;
* exibir resultado visual.

---

## Critérios de Aceite

* Botões funcionais
* Integração com backend
* Feedback visual funcionando

---

# Tarefa 8 — Painel de Logs

## Objetivo

Exibir eventos simulados na interface.

---

## Funcionalidades

* Mostrar últimos eventos
* Mostrar tipo do evento
* Mostrar status code
* Mostrar timestamp

---

## Critérios de Aceite

* Logs atualizando
* Eventos visíveis
* UI organizada

---

# Observabilidade

# Tarefa 9 — Dashboard Grafana Segurança

## Objetivo

Criar dashboard inicial de autenticação.

---

## Painéis obrigatórios

### Segurança

* Login success/min
* Login failures/min
* MFA failures
* Taxa de erro 401
* Tempo médio de autenticação

---

## Painéis visuais

* gráfico de linha
* gauge
* tabela de eventos

---

## Critérios de Aceite

* Dashboard funcional
* Dados atualizando em tempo real

---

# Tarefa 10 — Alertas

## Objetivo

Criar alertas básicos de segurança.

---

## Alertas obrigatórios

### Brute Force

Condição:

```txt id="s1qz34"
Mais de 10 falhas de login em 1 minuto
```

---

### Timeout elevado

Condição:

```txt id="z4rq7u"
Latência média acima de 3 segundos
```

---

## Critérios de Aceite

* Alertas configurados
* Alertas disparando corretamente

---

# Testes

# Cenários obrigatórios

## Login

* sucesso
* falha
* timeout

## MFA

* válido
* inválido
* expirado

## Logout

* sucesso

---

# Critérios Gerais da Sprint

## Backend

* Arquitetura modular
* Código limpo
* Sem duplicação
* Tratamento global de erros

---

## Frontend

* Componentização
* Feedback visual
* Responsividade básica

---

## Observabilidade

* Métricas funcionando
* Logs estruturados
* Dashboard operacional

---

# Critérios de Aceite Final

A Sprint 2 será considerada concluída quando:

* Todos endpoints funcionarem;
* Logs estruturados forem gerados;
* Métricas Prometheus estiverem disponíveis;
* Dashboard Grafana estiver operacional;
* Alertas funcionarem;
* Frontend conseguir disparar todos os cenários simulados.
