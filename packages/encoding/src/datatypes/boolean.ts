export function readBoolean(buffer: number[]) {
  const value = buffer.shift();

  return {
    value: value === 1,
    bytes: 1
  };
}

export function writeBoolean(value: boolean) {
  return [value ? 1 : 0];
}
