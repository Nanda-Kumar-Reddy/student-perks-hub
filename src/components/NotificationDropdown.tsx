import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
}

export default function NotificationDropdown({ notifications }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = items.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-card-hover z-50">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-display text-sm font-bold">Notifications</h3>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/50 last:border-0 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                    <div className={!n.read ? "" : "ml-4"}>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">{n.time}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
