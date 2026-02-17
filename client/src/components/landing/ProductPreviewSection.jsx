import SectionHeader from "./SectionHeader";
import { PREVIEW_COLUMNS, PREVIEW_TASKS } from "./constants";

function PreviewTaskCard({ task }) {
  return (
    <div
      className={`rounded-lg ${task.color} border border-border/50 p-4 hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing`}
    >
      <p className="text-sm font-medium text-foreground mb-3">{task.title}</p>
      <div className="flex items-center justify-between">
        <div className="h-6 w-6 rounded-full bg-primary/20 text-xs flex items-center justify-center text-primary font-semibold">
          {task.assignee.charAt(0)}
        </div>
        <span className="text-xs text-muted-foreground">{task.assignee}</span>
      </div>
    </div>
  );
}

function PreviewColumn({ title }) {
  const tasks = PREVIEW_TASKS[title] || [];

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
          {tasks.length}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <PreviewTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function ProductPreviewSection() {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="See Collab in action"
          description="A glimpse into how teams organize their work and collaborate effectively."
        />

        <div className="rounded-2xl border border-border bg-card p-8 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-max md:min-w-full">
            {PREVIEW_COLUMNS.map((column) => (
              <PreviewColumn key={column} title={column} />
            ))}
          </div>
        </div>

        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </section>
  );
}
