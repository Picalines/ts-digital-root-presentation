export function digitalRoot(n: number): number {
  n = Math.floor(n);

  if (n < 0) {
    throw new Error(`${digitalRoot.name} received negative number`);
  }

  return n <= 9 ? n : digitalRoot((n % 10) + digitalRoot(n / 10));
}
