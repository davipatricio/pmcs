import { Buffer } from 'node:buffer';
import { readVarInt, writeVarInt } from '@pmcs/encoding';

export class RawPacket {
  public constructor(
    public id = 0,
    public data: number[] = [],
  ) {}

  public setID(id: number[]) {
    this.id = readVarInt(id).value;
    return this;
  }

  public setData(data: number[]) {
    this.data = data;
    return this;
  }

  /**
   * Returns the length of the current packet (including the ID)
   */
  public get length() {
    return writeVarInt(this.data.length + 1);
  }

  /**
   * Returns the buffer of the current packet
   *
   * @returns The buffer of the current packet
   */
  public getBuffer() {
    return Buffer.from([...this.length, this.id, ...this.data]);
  }

  /**
   * Returns an array of packets from a buffer
   *
   * @param buffer - The buffer to read from
   * @returns An array of packets
   */
  public static fromBuffer(buffer: Buffer) {
    const packets: RawPacket[] = [];
    let bufferArray = [...buffer];

    while (bufferArray.length > 0) {
      const packetLength = readVarInt(bufferArray);
      const packetId = readVarInt(bufferArray.slice(packetLength.bytes));
      const packetData = bufferArray.slice(packetLength.bytes + packetId.bytes);

      const packet = new RawPacket().setID([packetId.value]).setData(packetData);

      packets.push(packet);

      bufferArray = bufferArray.slice(packetLength.value + 1);
    }

    return packets;
  }
}
