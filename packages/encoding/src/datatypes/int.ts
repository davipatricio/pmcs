export function readInt(number: number[]) {
  const bytes = number.splice(0, 4);
  let value = 0;

  for (let index = 0; index < 4; index++) {
    value |= bytes[index] << (index * 8);
  }

  return {
    value,
    bytes: 4
  };
}

export function writeInt(value: number) {
  const buffer: number[] = [];

  for (let index = 0; index < 4; index++) {
    buffer.push((value >> (index * 8)) & 0xff);
  }

  return buffer;
}
