import type { MCServer } from '@/structures/MCServer';

interface PluginLoadEventData {
  /**
   * The name of the plugin that was loaded.
   */
  name: string;
}

export default class PluginLoadEvent {
  public data: PluginLoadEventData;

  public constructor(public readonly server: MCServer) {}

  public setData(data: Partial<PluginLoadEventData>) {
    this.data = {
      ...this.data,
      ...data,
    };
    return this;
  }
}
