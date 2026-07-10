export type ProjectCategory =
  | "web-development"
  | "mobile-development"
  | "ai-ml"
  | "devops"
  | "blockchain"
  | "game-development"
  | "data-science"
  | "cybersecurity"
  | "ui-ux"
  | "other";

export type ProjectDifficulty = "beginner" | "intermediate" | "advanced";

export type ProjectStatus = "open" | "in-progress" | "completed" | "closed";

export interface IProject {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  requiredSkills: string[];
  image?: string;
  images?: string[];
  owner: string | { _id: string; name: string; email: string; photo?: string; bio?: string; location?: string; github?: string; linkedin?: string };
  status: ProjectStatus;
  maxMembers?: number;
  currentMembers?: number;
  deadline?: string;
  repository?: string;
  liveUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface IProjectCreateInput {
  title: string;
  shortDescription: string;
  description: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  requiredSkills: string[];
  image?: string;
  maxMembers?: number;
  deadline?: string;
  repository?: string;
  liveUrl?: string;
  tags?: string[];
}

export interface IProjectFilters {
  search?: string;
  category?: ProjectCategory;
  difficulty?: ProjectDifficulty;
  status?: ProjectStatus;
  skills?: string[];
  sort?: "newest" | "oldest" | "title-asc" | "title-desc";
  page?: number;
  limit?: number;
}
