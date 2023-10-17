export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type MCPartialServerOptions = RecursivePartial<MCServerOptions>;

export interface MCServerOptions {
  /**
   * Options related to incoming connections.
   */
  connection: {
    /**
     * Whether to enable compression. Defaults to `false`.
     */
    compress: boolean;
    /**
     * Whether to disable the Nagle algorithm. Defaults to `false`.
     */
    noDelay: boolean;
  };
  /**
   * Whether to enable the logger. Defaults to `true`.
   */
  enableLogger: boolean;
  /**
   * Options related to the server.
   */
  server: {
    /**
     * The default MOTD to send to clients. Can be changed at runtime. Defaults to `A Minecraft Server`.
     */
    defaultMotd: string;
    /**
     * Whether to force the gamemode on players when they join. Defaults to `false`.
     */
    forceGamemode: boolean;
    /**
     * The gamemode to set players to when they join. Defaults to `survival`.
     */
    gamemode: 'adventure' | 'creative' | 'spectator' | 'survival';
    /**
     * Whether to hide the sample of online players in the server list. Defaults to `false`.
     */
    hideOnlinePlayers: boolean;
    /**
     * The maximum amount of players that can be connected to the server at the same time. Can be changed at runtime. Defaults to `20`.
     */
    maxPlayers: number;
    /**
     * The port to listen on. Defaults to `25565`.
     */
    port: number;
  };
  /**
   * Information about the Minecraft version the server is running. Defaults to `1.20.2`.
   */
  version: {
    /**
     * The name of the Minecraft version or server software. Defaults to `1.20.2`.
     */
    name: string;
    /**
     * The protocol version of the Minecraft version or server software. Defaults to `764`.
     */
    protocol: number;
  };
}
