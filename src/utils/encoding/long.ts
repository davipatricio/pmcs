export function readLong(buffer: number[]) {
  const bytes = buffer.splice(0, 8);
  let value = 0n;

  for (let i = 0; i < 8; i++) {
    value |= BigInt(bytes[i]) << BigInt(i * 8);
  }

  return {
    value,
    bytes: 8,
  };
}

export function writeLong(value: bigint) {
  const buffer: number[] = [];

  for (let i = 0; i < 8; i++) {
    buffer.push(Number((value >> BigInt(i * 8)) & BigInt(0xff)));
  }

  return buffer;
}
