import { writeString } from '@pmcs/encoding';
import { RawPacket } from '../../../structures/RawPacket';
import type { ClientboundPacket } from '../../../types/ClientboundPacket';
import type { DisconnectReasonData } from '../../play';

export class LoginClientboundDisconnectPacket extends RawPacket implements ClientboundPacket {
  public payload: DisconnectReasonData;

  public constructor(data?: DisconnectReasonData) {
    super(0x00);
    if (data) this.parseData(data);
  }

  private parseData(data: DisconnectReasonData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Disconnect_.28login.29
  public encode() {
    this.setData(writeString(JSON.stringify(this.payload)));
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
