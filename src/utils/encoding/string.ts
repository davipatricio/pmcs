import { Buffer } from 'node:buffer';
import { readVarInt, writeVarInt } from './varInt';

export function readString(buffer: number[]) {
  const { value, bytes } = readVarInt(buffer);

  const stringBytes = buffer.slice(bytes, bytes + value);
  const string = Buffer.from(stringBytes).toString('utf8');

  return {
    value: string,
    bytes: bytes + value,
  };
}

export function writeString(value: string) {
  const buffer: number[] = [];
  const stringBytes = Buffer.from(value, 'utf8');
  const length = writeVarInt(stringBytes.length);

  buffer.push(...length);
  buffer.push(...stringBytes);

  return buffer;
}
