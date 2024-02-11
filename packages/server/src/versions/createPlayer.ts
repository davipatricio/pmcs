import type { Socket } from 'node:net';
import type { MCServer } from '..';
import PatchedPlayer from './1.8/PatchedPlayer';

export default function createPlayer(protocolVersion: number, { socket, server }: { server: MCServer; socket: Socket }) {
  switch (protocolVersion) {
    case 47:
      return new PatchedPlayer(socket, server);

    default:
      throw new Error(`Unknown protocol version: ${protocolVersion}`);
  }
}
