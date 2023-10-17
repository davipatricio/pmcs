export function readUnsignedByte(buffer: number[]) {
  return {
    value: buffer[0],
    bytes: 1,
  };
}

export function writeUnsignedByte(value: number) {
  const buffer: number[] = [];
  buffer.push(value);
  return buffer;
}
