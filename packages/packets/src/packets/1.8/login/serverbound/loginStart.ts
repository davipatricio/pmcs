import { Buffer } from 'node:buffer';
import { readString } from '@pmcs/encoding';
import { RawPacket } from '@/structures/RawPacket';
import type { ServerboundPacket } from '@/types/ServerboundPacket';

export class LoginServerboundLoginStartPacket extends RawPacket implements ServerboundPacket {
  public username: string;

  public constructor(data: Buffer | number[]) {
    super(0x00);

    this.data = data instanceof Buffer ? [...data] : data;
    this.parseData();
  }

  private parseData() {
    const name = readString(this.data);

    this.username = name.value;
  }

  public toJSON() {
    return {
      username: this.username,
    };
  }
}
