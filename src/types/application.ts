export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface IApplication {
  _id: string;
  projectId: string | { _id: string; title: string; image?: string };
  applicantId: string | { _id: string; name: string; email: string; photo?: string };
  message: string;
  status: ApplicationStatus;
  skills?: string[];
  githubProfile?: string;
  portfolioUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IApplicationCreateInput {
  projectId: string;
  message: string;
  skills?: string[];
  githubProfile?: string;
  portfolioUrl?: string;
}
