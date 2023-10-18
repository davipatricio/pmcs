import type { MCServer } from '../structures/MCServer';
import type { MCServerEvents } from '../types/MCServerEvents';

/**
 * Calls all the listeners for a given event.
 *
 * @param server - The server to call the events on
 * @param eventName - The name of the event to call
 * @param eventClass - The event class to call
 * @example
 * callEvents(server, 'playerJoin', new PlayerJoinEvent(player));
 */
export default function callEvents(server: MCServer, eventName: keyof MCServerEvents, eventClass: any) {
  const listeners = server.listeners(eventName);

  for (const listener of listeners) {
    listener(eventClass);
  }
}
