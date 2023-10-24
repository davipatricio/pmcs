import { Buffer } from 'node:buffer';
import { readString, readUUID } from '@pmcs/encoding';
import { RawPacket } from '@/structures/RawPacket';
import type { ServerboundPacket } from '@/types/ServerboundPacket';

export class LoginServerboundLoginStartPacket extends RawPacket implements ServerboundPacket {
  public username: string;
  public uuid: string;

  public constructor(data: Buffer | number[]) {
    super(0x00);

    this.data = data instanceof Buffer ? [...data] : data;
    this.parseData();
  }

  private parseData() {
    const name = readString(this.data);
    const playerUuid = readUUID(this.data.slice(name.bytes));

    this.username = name.value;
    this.uuid = playerUuid.value;
  }

  public toJSON() {
    return {
      username: this.username,
      uuid: this.uuid,
    };
  }
}
