export interface CancellableEvent {
  cancelled: boolean;
  setCancelled(cancelled: boolean): this;
}
