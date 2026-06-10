# Projeto
Simulador de Internet Banking para Observabilidade.

# Objetivo
Simular operações bancárias para gerar métricas,
logs e incidentes monitoráveis em Grafana/Prometheus.

# Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + TypeScript
- Observabilidade: Prometheus + Grafana
- Logs: Winston/Pino
- Containers: Docker Compose

# Regras
- Código modular
- Arquitetura em camadas
- Logs estruturados JSON
- Todas rotas devem gerar métricas
- Todas respostas devem incluir latency
- Não usar banco real
- Simulações fake em memória

# Endpoints principais
- /auth/login
- /transactions/pix
- /payments/boleto
- /health

# Métricas obrigatórias
- request_count
- error_rate
- latency
- pix_volume
- login_failures

# Objetivo do dashboard
Monitorar:
- Infraestrutura
- Segurança
- Transações
- Incidente