import axios from "axios";
import {
  IProject,
  IProjectCreateInput,
  IProjectFilters,
  PaginatedResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const projectService = {
  async getProjects(filters: IProjectFilters = {}): Promise<PaginatedResponse<IProject>> {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.status) params.set("status", filters.status);
    if (filters.skills) params.set("skills", filters.skills.join(","));
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  },

  async getProject(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: IProjectCreateInput) {
    const response = await api.post("/projects", data);
    return response.data;
  },

  async updateProject(id: string, data: Partial<IProjectCreateInput>) {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
