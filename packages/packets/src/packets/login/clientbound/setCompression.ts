import { writeVarInt } from '@pmcs/encoding';
import { RawPacket } from '../../../structures/RawPacket';
import type { ClientboundPacket } from '../../../types/ClientboundPacket';

export interface CompressionPacketData {
  threshold: number;
}

export class LoginClientboundSetCompressionPacket extends RawPacket implements ClientboundPacket {
  public payload: CompressionPacketData;

  public constructor(data?: CompressionPacketData) {
    super(0x03);
    if (data) this.parseData(data);
  }

  private parseData(data: CompressionPacketData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Set_Compression
  public encode() {
    this.setData([...writeVarInt(this.payload.threshold)]);
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
