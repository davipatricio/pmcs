import { Buffer } from 'node:buffer';

export function readUUID(buffer: number[]) {
  const uuidBytes = buffer.slice(0, 16);
  const uuid = Buffer.from(uuidBytes).toString('hex');

  return {
    value: uuid,
    bytes: 16,
  };
}

export function writeUUID(value: string) {
  const buffer: number[] = [];
  const uuidBytes = Buffer.from(value, 'hex');

  buffer.push(...uuidBytes);

  return buffer;
}
