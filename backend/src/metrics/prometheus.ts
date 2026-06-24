import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'endpoint', 'status_code'],
});

export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
});

export const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'endpoint', 'status_code'],
});

export const loginSuccessTotal = new client.Counter({
  name: 'login_success_total',
  help: 'Total number of successful logins',
});

export const loginFailuresTotal = new client.Counter({
  name: 'login_failures_total',
  help: 'Total number of failed login attempts',
});

export const mfaSuccessTotal = new client.Counter({
  name: 'mfa_success_total',
  help: 'Total number of successful MFA verifications',
});

export const mfaFailuresTotal = new client.Counter({
  name: 'mfa_failures_total',
  help: 'Total number of failed MFA attempts',
});

export const authTimeoutTotal = new client.Counter({
  name: 'auth_timeout_total',
  help: 'Total number of authentication timeouts',
});

export const authRequestDurationSeconds = new client.Histogram({
  name: 'auth_request_duration_seconds',
  help: 'Duration of authentication requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10],
});

export const pixTransactionsTotal = new client.Counter({
  name: 'pix_transactions_total',
  help: 'Total number of successful PIX transactions',
});

export const pixFailuresTotal = new client.Counter({
  name: 'pix_failures_total',
  help: 'Total number of failed PIX transactions',
});

export const pixTimeoutTotal = new client.Counter({
  name: 'pix_timeout_total',
  help: 'Total number of PIX timeouts',
});

export const boletoPaymentsTotal = new client.Counter({
  name: 'boleto_payments_total',
  help: 'Total number of successful boleto payments',
});

export const boletoFailuresTotal = new client.Counter({
  name: 'boleto_failures_total',
  help: 'Total number of failed boleto payments',
});

export const financeRequestDurationSeconds = new client.Histogram({
  name: 'finance_request_duration_seconds',
  help: 'Duration of finance requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10],
});

export const transactionVolumeTotal = new client.Gauge({
  name: 'transaction_volume_total',
  help: 'Total transaction volume amount',
});

export const deviceRegistrationsTotal = new client.Counter({
  name: 'device_registrations_total',
  help: 'Total number of device registrations',
});

export const suspiciousActionsTotal = new client.Counter({
  name: 'suspicious_actions_total',
  help: 'Total number of suspicious actions detected',
});

export const limitChangesTotal = new client.Counter({
  name: 'limit_changes_total',
  help: 'Total number of PIX limit changes',
});

export const bruteForceAttemptsTotal = new client.Counter({
  name: 'brute_force_attempts_total',
  help: 'Total number of brute force login attempts',
});

export const securityRequestDurationSeconds = new client.Histogram({
  name: 'security_request_duration_seconds',
  help: 'Duration of security requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10],
});

export const incidentsTotal = new client.Counter({
  name: 'incidents_total',
  help: 'Total number of incidents triggered',
});

export const serviceDownTotal = new client.Counter({
  name: 'service_down_total',
  help: 'Total number of service down incidents',
});

export const timeoutEventsTotal = new client.Counter({
  name: 'timeout_events_total',
  help: 'Total number of timeout events',
});

export const internalErrorsTotal = new client.Counter({
  name: 'internal_errors_total',
  help: 'Total number of internal error incidents',
});

export const overloadEventsTotal = new client.Counter({
  name: 'overload_events_total',
  help: 'Total number of overload events',
});

export const simulatedCpuUsage = new client.Gauge({
  name: 'simulated_cpu_usage',
  help: 'Simulated CPU usage percentage',
});

export const simulatedMemoryUsage = new client.Gauge({
  name: 'simulated_memory_usage',
  help: 'Simulated memory usage percentage',
});

export const activeIncidentsGauge = new client.Gauge({
  name: 'active_incidents_total',
  help: 'Number of currently active incidents',
});

export const incidentRequestDurationSeconds = new client.Histogram({
  name: 'incident_request_duration_seconds',
  help: 'Duration of incident requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10],
});

export { client };
