import { createChatComponent } from '@pmcs/chat';
import { LoginClientboundDisconnectPacket, PlayClientboundDisconnectPacket } from '@pmcs/packets/1.8';
import PlayerQuitEvent from '@/events/PlayerQuitEvent';
import { Player, PlayerState } from '@/structures';
import callEvents from '@/utils/callEvents';

export default class PatchedPlayer extends Player {
  /**
   * Kicks the player from the server with the specified reason.
   *
   * @param reason - The reason the player is being kicked. e.g. `§cYou have been kicked.`
   */
  public kick(reason: string) {
    const reasonComponent = createChatComponent(reason);

    this._forcedDisconnect = true;

    switch (this.state) {
      case PlayerState.Play:
        this.sendPacket(new PlayClientboundDisconnectPacket(reasonComponent));
        break;
      case PlayerState.Login:
        this.sendPacket(new LoginClientboundDisconnectPacket(reasonComponent));
        break;
      default:
        break;
    }

    this.disconnect();

    const quitEvent = new PlayerQuitEvent(this, { wasKicked: true, reason });
    callEvents(this.server, 'playerQuit', quitEvent);
  }
}
