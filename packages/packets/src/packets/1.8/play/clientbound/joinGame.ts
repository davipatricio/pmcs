import { writeBoolean, writeByte, writeInt, writeString, writeUnsignedByte } from '@pmcs/encoding';
import { RawPacket } from '@/structures/RawPacket';
import type { ClientboundPacket } from '@/types/ClientboundPacket';

/**
 * A string containing the reason for the disconnect or a Chat component.
 */
export interface JoinGameData {
  difficulty: number;
  dimension: number;
  entityId: number;
  gamemode: number;
  levelType: 'amplified' | 'default_1_1' | 'default' | 'flat' | 'largeBiomes';
  maxPlayers: number;
  reducedDebugInfo: boolean;
}

export class PlayClientboundJoinGamePacket extends RawPacket implements ClientboundPacket {
  public payload: JoinGameData;

  public constructor(data?: JoinGameData) {
    super(0x01);
    if (data) this.parseData(data);
  }

  private parseData(data: JoinGameData) {
    this.payload = data;
    this.encode();
  }

  // https://wiki.vg/index.php?title=Protocol&oldid=7368#Join_Game
  public encode() {
    this.setData([
      ...writeInt(this.payload.entityId),
      ...writeUnsignedByte(this.payload.gamemode),
      ...writeByte(this.payload.dimension),
      ...writeUnsignedByte(this.payload.difficulty),
      ...writeUnsignedByte(this.payload.maxPlayers),
      ...writeString(this.payload.levelType),
      ...writeBoolean(this.payload.reducedDebugInfo),
    ]);
    return this;
  }

  public toJSON() {
    return this.payload;
  }
}
