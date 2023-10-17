export function readLong(buffer: number[]) {
  const bytes = buffer.splice(0, 8);
  let value = 0n;

  for (let index = 0; index < 8; index++) {
    value |= BigInt(bytes[index]) << BigInt(index * 8);
  }

  return {
    value,
    bytes: 8,
  };
}

export function writeLong(value: bigint) {
  const buffer: number[] = [];

  for (let index = 0; index < 8; index++) {
    buffer.push(Number((value >> BigInt(index * 8)) & BigInt(0xff)));
  }

  return buffer;
}
