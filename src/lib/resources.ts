export type Resource = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  featured?: boolean;
};

export const resources: Resource[] = [
  {
    id: "studio-toolkit",
    title: "Studio Toolkit",
    category: "Developer Tools",
    description: "A curated collection of handy utilities for everyday development.",
    tags: ["tools", "utility", "developer"],
    featured: true,
  },
  {
    id: "ui-components",
    title: "UI Components Pack",
    category: "Web Development",
    description: "Reusable interface ideas for dashboards and modern web projects.",
    tags: ["react", "ui", "web"],
    featured: true,
  },
  {
    id: "server-starter",
    title: "Server Starter",
    category: "Templates",
    description: "A starter checklist for organizing a small community server project.",
    tags: ["starter", "community", "template"],
  },
  {
    id: "code-snippets",
    title: "Code Snippets",
    category: "Learning",
    description: "Small example snippets to help you learn and prototype faster.",
    tags: ["code", "learning", "examples"],
  },
];

export const categories = ["All", ...Array.from(new Set(resources.map((item) => item.category)))];
