import { readVarInt } from "../utils/encoding/varInt";

export default class Packet {
  id: number = 0;
  data: number[] = [];

  constructor(id?: number, data?: number[]) {
    this.id = id ?? this.id;
    this.data = data ?? this.data;
  }

  setID(id: number[]) {
    this.id = readVarInt(id).value;
    return this;
  }

  setData(data: number[]) {
    this.data = data;
    return this;
  }

  /**
   * Returns the length of the current packet (including the ID)
   */
  get length() {
    return this.data.length + 1;
  }

  /**
   * Returns the buffer of the current packet
   * @returns The buffer of the current packet
   */
  getBuffer() {
    return Buffer.from([this.length, this.id, ...this.data]);
  }

  /**
   * Returns an array of packets from a buffer
   * @param buffer The buffer to read from
   * @returns An array of packets
   */
  static fromBuffer(buffer: Buffer) {
    const packets: Packet[] = [];

    while (buffer.length > 0) {
      const bufferArray = [...buffer];

      const packetLength = readVarInt(bufferArray);
      const packetId = readVarInt(bufferArray.slice(packetLength.bytes));
      const packetData = bufferArray.slice(packetLength.bytes + packetId.bytes);

      const packet = new Packet().setID([packetId.value]).setData(packetData);

      packets.push(packet);

      buffer = buffer.subarray(packetLength.value + 1);
    }

    return packets;
  }
}
