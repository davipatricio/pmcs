import { type ChatComponent } from '@pmcs/chat';
import { writeString } from '@pmcs/encoding';
import { RawPacket } from '../../../structures/RawPacket';

export interface StatusResponsePacketData {
  description: ChatComponent;
  enforcesSecureChat?: boolean;
  favicon?: string;
  players: {
    max: number;
    online: number;
    sample?: {
      id: string;
      name: string;
    }[];
  };
  previewsChat?: boolean;
  version: {
    name: string;
    protocol: number;
  };
}

export class StatusClientboundStatusResponsePacket extends RawPacket {
  public payload: StatusResponsePacketData;

  public constructor(data?: StatusResponsePacketData) {
    super(0x00);
    if (data) this.parseData(data);
  }

  private parseData(data: StatusResponsePacketData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/Protocol#Status_Response
  public encode() {
    this.setData(writeString(JSON.stringify(this.toJSON())));
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
