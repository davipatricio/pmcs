import type { MCServer } from '../structures/MCServer';
import BaseEvent from './BaseEvent';

interface PluginLoadEventData {
  /**
   * The name of the plugin that was loaded.
   */
  name: string;
}

export default class PluginLoadEvent extends BaseEvent {
  public data!: PluginLoadEventData;
  public constructor(public readonly server: MCServer) {
    super();
  }

  public setData(data: Partial<PluginLoadEventData>) {
    this.data = {
      ...this.data,
      ...data,
    };
    return this;
  }
}
