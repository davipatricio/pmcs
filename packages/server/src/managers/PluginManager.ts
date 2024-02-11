/* eslint-disable promise/prefer-await-to-callbacks */
import PluginLoadEvent from '@/events/PluginLoadEvent';
import PluginUnloadEvent from '@/events/PluginUnloadEvent';
import type { MCServer } from '@/structures/MCServer';
import callEvents from '@/utils/callEvents';

export interface LoadPluginCallback {
  load(server: MCServer): void;
  unload(server: MCServer): void;
}

export class PluginManager {
  public plugins = new Map<string, LoadPluginCallback>();
  // biome-ignore lint/nursery/noEmptyBlockStatements: <explanation>
  public constructor(public server: MCServer) {}

  public loadPlugin(name: string, callback: LoadPluginCallback) {
    this.plugins.set(name, callback);

    callback.load(this.server);

    const event = new PluginLoadEvent(this.server).setData({ name });
    callEvents(this.server, 'pluginLoad', event);
  }

  public unloadPlugin(name: string) {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    plugin.unload(this.server);

    const event = new PluginUnloadEvent(this.server).setData({ name });
    callEvents(this.server, 'pluginUnload', event);
  }
}
