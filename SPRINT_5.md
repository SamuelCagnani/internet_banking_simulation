# SPRINT 05 — Incidentes e Chaos Engineering

# Objetivo

Criar simulações de incidentes operacionais, falhas de infraestrutura e cenários de caos controlado para observabilidade avançada.

---

# Visão Geral

A Sprint 5 introduz falhas artificiais e simulações operacionais críticas.

---

# Backend

# Tarefa 1 — Módulo de Incidentes

## Estrutura esperada

```txt id="jlwmfx"
src/modules/incidents/
├── controllers/
├── services/
├── routes/
├── dto/
├── validators/
└── types/
```

---

# Tarefa 2 — Simulação de Queda de Serviço

## Endpoint

```txt id="s3jpt9"
POST /api/v1/incidents/service-down
```

---

## Comportamento

* retornar 503;
* alterar healthcheck para DOWN;
* gerar alerta.

---

# Tarefa 3 — Simulação de Timeout

## Endpoint

```txt id="0i1yqf"
POST /api/v1/incidents/timeout
```

---

## Comportamento

* delays artificiais;
* timeout em endpoints financeiros.

---

# Tarefa 4 — Simulação de Erro 500

## Endpoint

```txt id="jlwmx5"
POST /api/v1/incidents/internal-error
```

---

## Comportamento

* gerar exceções controladas;
* retornar HTTP 500.

---

# Tarefa 5 — Simulação de Sobrecarga

## Endpoint

```txt id="u0zvpc"
POST /api/v1/incidents/overload
```

---

## Comportamento

* gerar múltiplas requisições;
* elevar métricas artificialmente;
* aumentar latência.

---

# Tarefa 6 — Métricas de Infraestrutura

## Counters

```txt id="jlwm0m"
incidents_total
service_down_total
timeout_events_total
internal_errors_total
overload_events_total
```

---

## Gauges

```txt id="gsy9jq"
simulated_cpu_usage
simulated_memory_usage
active_incidents_total
```

---

# Tarefa 7 — Logs de Incidentes

## Eventos obrigatórios

* SERVICE_DOWN
* TIMEOUT_EVENT
* INTERNAL_ERROR
* OVERLOAD_DETECTED
* HEALTHCHECK_FAILED

---

# Frontend

# Tarefa 8 — Painel de Incidentes

## Botões obrigatórios

* Simular queda
* Simular timeout
* Simular erro 500
* Simular sobrecarga
* Restaurar sistema

---

## Feedback visual

Mostrar:

* incidentes ativos;
* status do sistema;
* alertas ativos;
* tempo de recuperação.

---

# Observabilidade

# Tarefa 9 — Dashboard de Incidentes

## Painéis obrigatórios

* Serviços DOWN
* Taxa de erro 5xx
* Latência crítica
* Uso simulado de CPU
* Uso simulado de memória
* Incidentes ativos

---

# Tarefa 10 — Alertas Críticos

## Alertas obrigatórios

### Serviço DOWN

```txt id="jlwmn4"
Healthcheck DOWN por mais de 30 segundos
```

### Explosão de erros

```txt id="ew8qjv"
Mais de 20 erros 5xx por minuto
```

### Latência extrema

```txt id="yzjlwm"
Latência média > 5 segundos
```

---

# Chaos Engineering

# Tarefa 11 — Recuperação Automática

## Objetivo

Permitir restaurar o sistema após incidentes.

## Endpoint

```txt id="jlwm1d"
POST /api/v1/incidents/recover
```

---

# Critérios de Aceite Final

* Incidentes simuláveis;
* Alertas funcionando;
* Dashboards operacionais;
* Sistema recuperável;
* Logs estruturados gerados;
* Métricas exportadas corretamente.
