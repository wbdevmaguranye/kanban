import type { Board } from "./board";

export const initialBoard: Board = {
  columns: [
    { id: "backlog", title: "Backlog", color: "#0052CC", cardIds: ["c1", "c2", "c3"] },
    { id: "todo", title: "To Do", color: "#2684FF", cardIds: ["c4", "c5"] },
    { id: "progress", title: "In Progress", color: "#753991", cardIds: ["c6", "c7"] },
    { id: "review", title: "Review", color: "#00B8D9", cardIds: ["c8"] },
    { id: "done", title: "Done", color: "#36B37E", cardIds: ["c9", "c10"] },
  ],
  cards: {
    c1: { id: "c1", title: "Research competitor onboarding", details: "Review sign-up flows of three leading tools and summarise key patterns." },
    c2: { id: "c2", title: "Draft Q3 roadmap", details: "Outline themes and milestones for the next quarter." },
    c3: { id: "c3", title: "Audit accessibility", details: "Check colour contrast and keyboard navigation across core screens." },
    c4: { id: "c4", title: "Design settings page", details: "Wireframes for account, notifications and billing tabs." },
    c5: { id: "c5", title: "Set up error monitoring", details: "Configure alerts for the production environment." },
    c6: { id: "c6", title: "Build card drag and drop", details: "Smooth movement of cards between columns." },
    c7: { id: "c7", title: "Write API documentation", details: "Document endpoints, parameters and example responses." },
    c8: { id: "c8", title: "Refine colour palette", details: "Align brand colours with the new design system." },
    c9: { id: "c9", title: "Project kickoff", details: "Align on goals, scope and team responsibilities." },
    c10: { id: "c10", title: "Set up repository", details: "Initialise the codebase, linting and CI pipeline." },
  },
};
