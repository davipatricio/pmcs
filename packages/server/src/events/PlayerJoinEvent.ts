import type { Player } from '@/structures/Player';

export default class PlayerJoinEvent {
  public constructor(public readonly player: Player) {}
}
