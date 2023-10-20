import { writeString, writeVarInt } from '@pmcs/encoding';
import { RawPacket } from '@/structures/RawPacket';
import type { ClientboundPacket } from '@/types/ClientboundPacket';

export interface LoginSuccessPacketData {
  properties: [];
  username: string;
  uuid: string;
}

export class LoginClientboundLoginSuccessPacket extends RawPacket implements ClientboundPacket {
  public payload: LoginSuccessPacketData;

  public constructor(data?: LoginSuccessPacketData) {
    super(0x02);
    if (data) this.parseData(data);
  }

  private parseData(data: LoginSuccessPacketData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Login_Success
  public encode() {
    this.setData([...writeString(this.payload.uuid), ...writeString(this.payload.username), ...writeVarInt(0)]);
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
