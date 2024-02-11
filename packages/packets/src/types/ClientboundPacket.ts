export abstract class ClientboundPacket {
  public abstract payload: unknown;

  // biome-ignore lint/nursery/noEmptyBlockStatements: <explanation>
  public encode() {}

  public toJSON() {
    return this.payload;
  }
}
