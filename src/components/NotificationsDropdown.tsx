import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Transport Budget Exceeded",
    message: "You've reached your transport budget limit for this month.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Savings Added",
    message: "UGX 45,000 moved to your withdrawable savings.",
    time: "Yesterday",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Budget Reminder",
    message: "You have 5 days left in this month's budget cycle.",
    time: "2 days ago",
    read: true,
  },
];

export function NotificationsDropdown() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-warning/10 text-warning";
      case "success":
        return "bg-success/10 text-success";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Bell className="h-5 w-5 text-primary-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-success rounded-full" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          <p className="text-xs text-muted-foreground">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                !notification.read && "bg-primary/5"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  getIconColor(notification.type)
                )}
              >
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border">
          <button className="w-full text-center text-sm font-medium text-primary hover:underline">
            View All Notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
