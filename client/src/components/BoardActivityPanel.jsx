import { Card } from "./card";

const formatTime = (value) => {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export default function BoardActivityPanel({ activities, loading }) {
  return (
    <aside className="w-full lg:w-80 lg:flex-shrink-0">
      <Card className="h-full lg:sticky lg:top-24 bg-card/75 backdrop-blur-sm">
        <div className="p-4 border-b border-border/80">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Timeline</p>
          <h3 className="text-base font-semibold text-foreground mt-1">Activity</h3>
          <p className="text-xs text-muted-foreground mt-1">Latest board events</p>
        </div>

        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto hide-scrollbar">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id} className="rounded-lg border border-border/80 bg-background/40 p-3">
                <p className="text-sm leading-relaxed text-foreground">{activity.message}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">{activity.userId?.name || "System"}</span>
                  <span>{formatTime(activity.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </aside>
  );
}
