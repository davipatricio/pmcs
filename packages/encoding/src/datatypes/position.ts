import { readLong, writeLong } from './long';

export function writePosition(xAxis: number, yAxis: number, zAxis: number) {
  const value = BigInt(((xAxis & 0x3ffffff) << 38) | ((zAxis & 0x3ffffff) << 12) | (yAxis & 0xfff));
  return writeLong(value);
}

export function readPosition(buffer: number[]) {
  const { value, bytes } = readLong(buffer);
  const xAxis = Number((value >> 38n) & 0x3ffffffn);
  const zAxis = Number((value >> 12n) & 0x3ffffffn);
  const yAxis = Number(value & BigInt(0xfff));

  return {
    value: [xAxis, yAxis, zAxis],
    bytes
  };
}
