export function readByte(buffer: number[]) {
  return {
    value: buffer[0],
    bytes: 1,
  };
}

export function writeByte(value: number) {
  const buffer: number[] = [];
  buffer.push(value);
  return buffer;
}
