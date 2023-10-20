import { writeByte } from '@pmcs/encoding';
import { RawPacket } from '../../../../structures/RawPacket';
import type { ClientboundPacket } from '../../../../types/ClientboundPacket';

export interface SetHeldItemPacketData {
  slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

/**
 * Sent to change the player's slot selection.
 */
export class PlayClientboundSetHeldItemPacket extends RawPacket implements ClientboundPacket {
  public payload: SetHeldItemPacketData;

  public constructor(data?: SetHeldItemPacketData) {
    super(0x4f);
    if (data) this.parseData(data);
  }

  private parseData(data: SetHeldItemPacketData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Set_Held_Item
  public encode() {
    this.setData(writeByte(this.payload.slot));
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
