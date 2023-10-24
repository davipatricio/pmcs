import type { NamedProtocolVersions } from './utils/protocolVersions';
import { ProtocolVersions } from './utils/protocolVersions';
import * as v1_20_2 from './versions/1.20.2';
import * as v1_8 from './versions/1.8';

export function getVersionData(version: keyof typeof NamedProtocolVersions | keyof typeof ProtocolVersions) {
  if (typeof version === 'number') {
    return getVersionData(ProtocolVersions[version]);
  }

  switch (version) {
    case '1.8':
      return v1_8;
    case '1.20.2':
      return v1_20_2;
    default:
      throw new Error(`Unknown version: ${version}`);
  }
}

export * from '@/structures/RawPacket';
export * from '@/utils/protocolVersions';
