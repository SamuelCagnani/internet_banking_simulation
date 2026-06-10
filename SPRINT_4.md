# SPRINT 04 — Fraude e Segurança Avançada

# Objetivo

Simular cenários de fraude, atividades suspeitas e operações críticas de segurança do Internet Banking.

---

# Visão Geral

A Sprint 4 adiciona monitoramento avançado de segurança e comportamento suspeito.

---

# Backend

# Tarefa 1 — Módulo de Segurança

## Estrutura esperada

```txt id="tq0a1x"
src/modules/security/
├── controllers/
├── services/
├── routes/
├── dto/
├── validators/
└── types/
```

---

# Tarefa 2 — Registro de Dispositivo

## Endpoint

```txt id="rjlwmk"
POST /api/v1/devices/register
```

---

## Cenários obrigatórios

### Sucesso

Status:

```txt id="48z6x4"
201 Created
```

### Dispositivo suspeito

Status:

```txt id="g0hjlwm"
403 Forbidden
```

---

# Tarefa 3 — Alteração de Limite PIX

## Endpoint

```txt id="9jlwm0"
PUT /api/v1/user/limits
```

---

## Cenários obrigatórios

### Alteração válida

```txt id="2r8wpx"
200 OK
```

### Muitas alterações

```txt id="m1a0n4"
429 Too Many Requests
```

---

# Tarefa 4 — Simulação de Fraudes

## Cenários obrigatórios

* múltiplos logins falhos;
* múltiplos dispositivos;
* alteração excessiva de limites;
* pico de acessos;
* comportamento suspeito.

---

# Tarefa 5 — Logs de Auditoria

## Campos obrigatórios

```json id="g84y4y"
{
  "timestamp": "",
  "event_type": "SUSPICIOUS_DEVICE",
  "user_id": "",
  "ip_address": "",
  "risk_level": "HIGH",
  "status_code": 403
}
```

---

## Eventos obrigatórios

* DEVICE_REGISTERED
* DEVICE_BLOCKED
* LIMIT_CHANGED
* SUSPICIOUS_ACTIVITY
* BRUTE_FORCE_DETECTED

---

# Tarefa 6 — Métricas de Segurança

## Counters

```txt id="fptfgn"
device_registrations_total
suspicious_actions_total
limit_changes_total
brute_force_attempts_total
```

---

## Histograms

```txt id="mxjlwm"
security_request_duration_seconds
```

---

# Frontend

# Tarefa 7 — Painel de Segurança

## Botões obrigatórios

* Registrar dispositivo
* Simular dispositivo suspeito
* Alterar limite
* Simular brute force
* Simular atividade suspeita

---

# Observabilidade

# Tarefa 8 — Dashboard Segurança Avançada

## Painéis obrigatórios

* Novos dispositivos
* Atividades suspeitas
* Mudanças de limite
* Brute force attempts
* Heatmap de erros

---

# Tarefa 9 — Alertas

## Alertas obrigatórios

### Brute force

```txt id="jlwm5r"
Mais de 15 falhas em 1 minuto
```

### Atividade suspeita

```txt id="94m1t8"
Mais de 5 ações suspeitas em 2 minutos
```

---

# Critérios de Aceite Final

* Eventos suspeitos detectáveis;
* Logs de auditoria funcionando;
* Dashboards operacionais;
* Alertas funcionando.
