import { CONTINUE_BIT, SEGMENT_BITS } from '../constants/bits';

export function readVarLong(buffer: number[]) {
  let numRead = 0;
  let result = 0n;
  let read: number;

  do {
    if (numRead > 10) {
      throw new Error('VarLong is too big');
    }

    read = buffer.shift() ?? 0;
    const value = BigInt((read & SEGMENT_BITS) << (7 * numRead));
    result |= value;
    numRead++;
  } while ((read & CONTINUE_BIT) !== 0);

  return {
    value: result,
    bytes: numRead
  };
}

export function writeVarLong(value: bigint) {
  const buffer: number[] = [];
  let remaining = value;

  do {
    let temp = Number(remaining & BigInt(SEGMENT_BITS));
    remaining >>= 7n;

    if (remaining !== 0n) {
      temp |= CONTINUE_BIT;
    }

    buffer.push(temp);
  } while (remaining !== 0n);

  return buffer;
}
