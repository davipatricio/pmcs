import { Buffer } from 'node:buffer';
import { readVarInt, readString, readShort } from '@pmcs/encoding';
import { RawPacket } from '../../../structures/RawPacket';

export class HandshakingServerboundHandshakePacket extends RawPacket {
  public protocolVersion: number;
  public serverAddress: string;
  public serverPort: number;
  public nextState: number;

  public constructor(data: Buffer | number[]) {
    super(0x00);

    this.data = data instanceof Buffer ? [...data] : data;
    this.parseData();
  }

  private parseData() {
    const protocolVersion = readVarInt(this.data);
    const serverAddress = readString(this.data.slice(protocolVersion.bytes));
    const serverPort = readShort(this.data.slice(protocolVersion.bytes + serverAddress.bytes));
    const nextState = readVarInt(this.data.slice(protocolVersion.bytes + serverAddress.bytes + serverPort.bytes));

    this.protocolVersion = protocolVersion.value;
    this.serverAddress = serverAddress.value;
    this.serverPort = serverPort.value;
    this.nextState = nextState.value;
  }

  public toJSON() {
    return {
      protocolVersion: this.protocolVersion,
      serverAddress: this.serverAddress,
      serverPort: this.serverPort,
      nextState: this.nextState,
    };
  }
}
