export abstract class ServerboundPacket {
  public toJSON(): Record<string, unknown> | object {
    return {};
  }
}
