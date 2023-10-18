import { RawPacket } from '../../../structures/RawPacket';
import type { ServerboundPacket } from '../../../types/ServerboundPacket';

export class StatusServerboundStatusRequestPacket extends RawPacket implements ServerboundPacket {
  public constructor() {
    super(0x00);

    this.parseData();
  }

  private parseData() {}

  public toJSON() {
    return {};
  }
}
