import type BaseEvent from '../events/BaseEvent';
import type MCServer from '../structures/MCServer';

export default function callEvents(server: MCServer, eventName: string, event: BaseEvent) {
  const listeners = server.listeners(eventName);

  for (const listener of listeners) {
    listener(event);
  }
}
