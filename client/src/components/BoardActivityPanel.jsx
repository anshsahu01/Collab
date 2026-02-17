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

const normalizeMessage = (message) => (message || "").replace(/"/g, "");

export default function BoardActivityPanel({ activities, loading }) {
  return (
    <aside className="w-full lg:w-80 lg:flex-shrink-0">
      <Card className="h-full lg:sticky lg:top-24 border-border/70 bg-card/85 backdrop-blur-sm">
        <div className="p-4 border-b border-border/70">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Timeline</p>
          <h3 className="mt-1 text-base font-semibold text-foreground">Activity</h3>
          <p className="mt-1 text-xs text-muted-foreground">Latest board events</p>
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto p-4 hide-scrollbar">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          ) : activities.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 bg-background/30 p-4 text-sm text-muted-foreground">
              No activity yet.
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="rounded-xl border border-border/70 bg-background/45 px-3.5 py-3"
              >
                <p className="text-sm leading-relaxed text-foreground">
                  {normalizeMessage(activity.message)}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground/90">{activity.userId?.name || "System"}</span>
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
