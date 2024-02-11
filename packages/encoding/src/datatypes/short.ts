export function readShort(buffer: number[]) {
  const value = (buffer[0] << 8) | buffer[1];
  return {
    value,
    bytes: 2
  };
}

export function writeShort(value: number) {
  const buffer: number[] = [];
  buffer.push((value >> 8) & 0xff);
  buffer.push(value & 0xff);
  return buffer;
}
