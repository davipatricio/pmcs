import type { MCServer } from '@/structures/MCServer';

interface PluginUnloadEventData {
  /**
   * The name of the plugin that was loaded.
   */
  name: string;
}

export default class PluginUnloadEvent {
  public data: PluginUnloadEventData;

  // biome-ignore lint/nursery/noEmptyBlockStatements: <explanation>
  public constructor(public readonly server: MCServer) {}

  public setData(data: Partial<PluginUnloadEventData>) {
    this.data = {
      ...this.data,
      ...data
    };
    return this;
  }
}
