import type PlayerJoinEvent from '@/events/PlayerJoinEvent';
import type PlayerQuitEvent from '@/events/PlayerQuitEvent';
import type PluginLoadEvent from '@/events/PluginLoadEvent';
import type ServerListPingEvent from '@/events/ServerListPingEvent';

export interface MCServerEvents {
  playerJoin(event: PlayerJoinEvent): void;
  playerQuit(event: PlayerQuitEvent): void;
  pluginLoad(event: PluginLoadEvent): void;
  pluginUnload(event: PluginLoadEvent): void;
  serverListPing(event: ServerListPingEvent): void;
}
