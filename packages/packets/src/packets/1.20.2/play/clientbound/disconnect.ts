import { RawPacket } from '@/structures/RawPacket';
import type { ClientboundPacket } from '@/types/ClientboundPacket';
import type { ChatComponent } from '@pmcs/chat';
import { writeString } from '@pmcs/encoding';

/**
 * A string containing the reason for the disconnect or a Chat component.
 */
export type DisconnectReasonData = ChatComponent;

export class PlayClientboundDisconnectPacket extends RawPacket implements ClientboundPacket {
  public payload: DisconnectReasonData;

  public constructor(data?: DisconnectReasonData) {
    super(0x1b);
    if (data) this.parseData(data);
  }

  private parseData(data: DisconnectReasonData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Disconnect_.28play.29
  public encode() {
    this.setData(writeString(JSON.stringify(this.payload)));
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
