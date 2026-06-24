let forcedDown = false;

export function isServiceDown(): boolean {
  return forcedDown;
}

export function setServiceDown(down: boolean): void {
  forcedDown = down;
}

export function getHealthStatus(): { status: string } {
  if (forcedDown) {
    return { status: 'DOWN' };
  }
  const shouldSimulateFailure = Math.random() < 0.1;
  return { status: shouldSimulateFailure ? 'DOWN' : 'UP' };
}
