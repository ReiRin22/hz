type ResetFn = () => void;
const registry: ResetFn[] = [];

export function registerStore(resetFn: ResetFn): void {
  registry.push(resetFn);
}

export function resetAllStores(): void {
  registry.forEach((reset) => reset());
}
