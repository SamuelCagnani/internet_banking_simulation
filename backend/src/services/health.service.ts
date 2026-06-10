export function getHealthStatus(): { status: string } {
  const shouldSimulateFailure = Math.random() < 0.1;
  return { status: shouldSimulateFailure ? 'DOWN' : 'UP' };
}
