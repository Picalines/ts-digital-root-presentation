export function* joinIter<T, S>(array: readonly T[], separator: S) {
  if (array.length == 0) {
    return;
  }

  if (array.length == 1) {
    yield array[0];
    return;
  }

  for (let i = 0; i < array.length - 1; i++) {
    yield array[i];
    yield separator;
  }

  yield array[array.length - 1];
}
