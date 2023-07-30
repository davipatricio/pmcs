import { SEGMENT_BITS, CONTINUE_BIT } from "../constants/bits";


export function readVarInt(number: number[]) {
  let value = 0;
  let numBytes = 0;
  let shift = 0;
  let continueReading = true;

  while (continueReading) {
    const byte = number[numBytes];
    value |= (byte & 0x7F) << shift;
    shift += 7;
    numBytes++;

    continueReading = (byte & 0x80) !== 0 && numBytes < number.length;
  }

  return {
    bytes: numBytes,
    value: value,
  };
}

export function writeVarInt(value: number) {
  const buffer: number[] = [];
  let remaining = value;

  do {
    let temp = remaining & SEGMENT_BITS;
    remaining >>>= 7;

    if (remaining !== 0) {
      temp |= CONTINUE_BIT;
    }

    buffer.push(temp);
  } while (remaining !== 0);

  return buffer;
}
