export abstract class ClientboundPacket {
  public abstract payload: Record<string, unknown> | object;

  public encode() {}

  public toJSON() {
    return this.payload;
  }
}
