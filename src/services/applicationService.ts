import axios from "axios";
import {
  IApplication,
  IApplicationCreateInput,
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

export const applicationService = {
  async getApplications(params?: {
    projectId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<IApplication>> {
    const searchParams = new URLSearchParams();
    if (params?.projectId) searchParams.set("projectId", params.projectId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await api.get(`/applications?${searchParams.toString()}`);
    return response.data;
  },

  async getApplication(id: string) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  async applyToProject(data: IApplicationCreateInput) {
    const response = await api.post("/applications", data);
    return response.data;
  },

  async updateApplicationStatus(id: string, status: "accepted" | "rejected") {
    const response = await api.patch(`/applications/${id}`, { status });
    return response.data;
  },

  async withdrawApplication(id: string) {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};
