import { writeVarInt } from '@pmcs/encoding';
import { RawPacket } from '../../../structures/RawPacket';
import type { ClientboundPacket } from '../../../types/ClientboundPacket';

export interface SetRenderDistancePacketData {
  /**
   * A value between 2 and 32.
   */
  viewDistance: number;
}

export class PlayClientboundSetRenderDistancePacket extends RawPacket implements ClientboundPacket {
  public payload: SetRenderDistancePacketData;

  public constructor(data?: SetRenderDistancePacketData) {
    super(0x51);
    if (data) this.parseData(data);
  }

  private parseData(data: SetRenderDistancePacketData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Set_Render_Distance
  public encode() {
    this.setData([...writeVarInt(this.payload.viewDistance)]);
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
