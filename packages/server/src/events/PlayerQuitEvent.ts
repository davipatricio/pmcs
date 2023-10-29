import type { Player } from '@/structures/Player';

interface PlayerQuitEventData {
  reason?: string | null;
  wasKicked?: boolean;
}

export default class PlayerQuitEvent {
  public constructor(
    public readonly player: Player,
    public readonly data: PlayerQuitEventData = {},
  ) {
    this.data = data;
  }

  public setData(data: Partial<PlayerQuitEventData>) {
    Object.assign(this.data, data);
    return this;
  }
}
