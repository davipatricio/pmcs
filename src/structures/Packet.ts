import { readVarInt } from "../utils/encoding/varInt";

export default class Packet {
  id: number = 0;
  data: number[] = [];

  constructor() {}

  setID(id: number[]) {
    this.id = readVarInt(id).value;
  }

  setData(data: number[]) {
    this.data = data;
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
    const buffer = [];

    buffer.push(this.length);
    buffer.push(this.id);
    buffer.push(...this.data);

    return Buffer.from(buffer);
  }

  /**
   * Returns an array of packets from a buffer
   * @param buffer The buffer to read from
   * @returns An array of packets
   */
  static fromBuffer(buffer: Buffer) {
    const packets: Packet[] = [];
    const data = [...buffer];

    const readPacket = () => {
      const packet = new Packet();

      const packetLength = data.shift()!;
      packet.setID([data.shift()!]);
      packet.setData(data.splice(0, packetLength - 1));

      packets.push(packet);
    }

    while (data.length > 0) {
      readPacket();
    }

    return packets;
  }
}
