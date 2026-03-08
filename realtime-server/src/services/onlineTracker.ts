/**
 * Online User Tracker
 * Maps userId → Set of socket IDs (supports multiple tabs/devices)
 */
class OnlineTracker {
  private userSockets = new Map<string, Set<string>>();

  addUser(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  removeSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  isOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  getSocketIds(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) ?? []);
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }
}

export const onlineTracker = new OnlineTracker();
