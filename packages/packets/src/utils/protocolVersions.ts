const NamedProtocolVersions = {
  '1.8': 47,
  '1.20.2': 764,
};

const ProtocolVersions = Object.fromEntries(
  Object.entries(NamedProtocolVersions).map(([version, protocol]) => [protocol, version]),
) as Record<number, keyof typeof NamedProtocolVersions>;

export { ProtocolVersions, NamedProtocolVersions };
