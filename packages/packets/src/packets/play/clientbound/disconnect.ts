import type { ChatComponent } from '@pmcs/chat';
import { writeString } from '@pmcs/encoding';
import { RawPacket } from '../../../structures/RawPacket';
import type { ClientboundPacket } from '../../../types/ClientboundPacket';

/**
 * A string containing the reason for the disconnect or a Chat component.
 */
export type DisconnectReasonData = ChatComponent | string;

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
    if (typeof this.payload === 'string') {
      this.setData(writeString(JSON.stringify({ text: this.payload })));
    }

    this.setData(writeString(JSON.stringify(this.payload)));
    return this;
  }

  public toJSON() {
    return typeof this.payload === 'string' ? { text: this.payload } : this.payload;
  }
}
