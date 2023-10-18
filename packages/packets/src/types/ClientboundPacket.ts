export abstract class ClientboundPacket {
  public abstract payload: unknown;

  public encode() {}

  public toJSON() {
    return this.payload;
  }
}
