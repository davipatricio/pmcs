import type MCServer from '../structures/MCServer';
import BaseEvent from './BaseEvent';

interface PluginUnloadEventData {
  /**
   * The name of the plugin that was loaded.
   */
  name: string;
}

export default class PluginUnloadEvent extends BaseEvent {
  public data!: PluginUnloadEventData;
  public constructor(public readonly server: MCServer) {
    super();
  }

  public setData(data: Partial<PluginUnloadEventData>) {
    this.data = {
      ...this.data,
      ...data,
    };
    return this;
  }
}
