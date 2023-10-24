import type { ChatComponent } from '@pmcs/chat';
import { writeString } from '@pmcs/encoding';
import { RawPacket } from '@/structures/RawPacket';
import type { ClientboundPacket } from '@/types/ClientboundPacket';

/**
 * A string containing the reason for the disconnect or a Chat component.
 */
export type DisconnectReasonData = ChatComponent;

export class PlayClientboundDisconnectPacket extends RawPacket implements ClientboundPacket {
  public payload: DisconnectReasonData;

  public constructor(data?: DisconnectReasonData) {
    super(0x00);
    if (data) this.parseData(data);
  }

  private parseData(data: DisconnectReasonData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/index.php?title=Protocol&oldid=7368#Disconnect_2
  public encode() {
    this.setData(writeString(JSON.stringify(this.payload)));
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
