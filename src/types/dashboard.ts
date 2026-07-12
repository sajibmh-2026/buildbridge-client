import { IProject } from "./project";
import { IApplication } from "./application";
import { IUser } from "./user";

export interface IDashboardStats {
  totalProjects: number;
  totalApplications: number;
  totalApplicationsReceived: number;
  activeProjects: number;
  applicationStatusCounts: {
    pending: number;
    accepted: number;
    rejected: number;
  };
}

export interface IChartData {
  _id: string;
  count: number;
}

export interface IMonthlyData {
  _id: { year: number; month: number };
  count: number;
}

export interface IDashboardData {
  stats: IDashboardStats;
  projects: IProject[];
  applications: IApplication[];
  charts: {
    categoryStats: IChartData[];
    difficultyStats: IChartData[];
  };
}

export interface IAdminStats {
  totalUsers: number;
  totalProjects: number;
  totalApplications: number;
}

export interface IAdminDashboardData {
  stats: IAdminStats;
  usersByRole: IChartData[];
  charts: {
    projectsByCategory: IChartData[];
    projectsByDifficulty: IChartData[];
    projectsByStatus: IChartData[];
    applicationsByStatus: IChartData[];
    monthlyUsers: IMonthlyData[];
    monthlyProjects: IMonthlyData[];
  };
  recentUsers: IUser[];
  recentProjects: IProject[];
}
