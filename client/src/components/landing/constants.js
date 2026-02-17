export const FEATURE_ITEMS = [
  {
    title: "Real-time Collaboration",
    description:
      "See changes as they happen. Collaborate with your team in real-time without delays or conflicts.",
    icon: "⚡",
  },
  {
    title: "Drag & Drop Tasks",
    description:
      "Organize your work intuitively. Move tasks between columns and prioritize work with simple gestures.",
    icon: "✋",
  },
  {
    title: "Team Assignment",
    description:
      "Assign tasks to team members instantly. Keep everyone on the same page with clear ownership.",
    icon: "👥",
  },
  {
    title: "Activity Tracking",
    description:
      "Track every action with detailed activity logs. Know who changed what and when.",
    icon: "📊",
  },
];

export const PREVIEW_COLUMNS = ["To Do", "In Progress", "Review", "Done"];

export const PREVIEW_TASKS = {
  "To Do": [
    { id: 1, title: "Design new landing page", assignee: "Sarah", color: "bg-primary/20" },
    { id: 2, title: "Setup database schema", assignee: "Alex", color: "bg-blue-500/20" },
  ],
  "In Progress": [
    { id: 3, title: "Implement real-time sync", assignee: "Jordan", color: "bg-cyan-500/20" },
    { id: 4, title: "Write API documentation", assignee: "Mike", color: "bg-indigo-500/20" },
  ],
  Review: [{ id: 5, title: "Code review - Auth module", assignee: "Emma", color: "bg-purple-500/20" }],
  Done: [
    { id: 6, title: "Setup deployment pipeline", assignee: "Alex", color: "bg-green-500/20" },
    { id: 7, title: "Configure CI/CD", assignee: "Jordan", color: "bg-emerald-500/20" },
  ],
};

export const FOOTER_SECTIONS = {
  Product: ["Features", "Security", "Integrations", "Pricing"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "API Reference", "Changelog", "Support"],
  Legal: ["Privacy", "Terms of Service", "Cookie Policy", "GDPR"],
};

export const SOCIAL_LINKS = ["Twitter", "LinkedIn", "GitHub"];
