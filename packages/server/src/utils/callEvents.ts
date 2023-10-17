import type BaseEvent from '../events/BaseEvent';
import type { MCServer } from '../structures/MCServer';
import type { MCServerEvents } from '../types/MCServerEvents';

export default function callEvents(server: MCServer, eventName: keyof MCServerEvents, event: BaseEvent) {
  const listeners = server.listeners(eventName);

  for (const listener of listeners) {
    listener(event);
  }
}
