import { RawPacket } from '@/structures/RawPacket';
import type { ClientboundPacket } from '@/types/ClientboundPacket';
import { writeString } from '@pmcs/encoding';
import { v3 as uuidv3 } from 'uuid';

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

  // https://wiki.vg/index.php?title=Protocol&oldid=7368#Login_Success
  public encode() {
    const uuid = uuidv3('playerName', uuidv3.URL);

    this.setData([...writeString(uuid), ...writeString(this.payload.username)]);
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
