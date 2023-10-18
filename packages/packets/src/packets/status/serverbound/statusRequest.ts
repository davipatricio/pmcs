import { RawPacket } from '../../../structures/RawPacket';

export class StatusServerboundStatusRequestPacket extends RawPacket {
  public constructor() {
    super(0x00);

    this.parseData();
  }

  private parseData() {}

  public toJSON() {
    return {};
  }
}
