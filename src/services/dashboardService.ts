import axios from "axios";
import { IDashboardData, IAdminDashboardData, ApiResponse, IUser, PaginatedResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export const dashboardService = {
  async getStats(): Promise<ApiResponse<IDashboardData>> {
    const response = await api.get<ApiResponse<IDashboardData>>("/dashboard/stats");
    return response.data;
  },

  async getAdminStats(): Promise<ApiResponse<IAdminDashboardData>> {
    const response = await api.get<ApiResponse<IAdminDashboardData>>("/dashboard/admin-stats");
    return response.data;
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<IUser>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await api.get<PaginatedResponse<IUser>>(
      `/dashboard/users?${searchParams.toString()}`
    );
    return response.data;
  },

  async updateUserRole(
    userId: string,
    role: "user" | "admin"
  ): Promise<ApiResponse<IUser>> {
    const response = await api.patch<ApiResponse<IUser>>(
      `/dashboard/users/${userId}/role`,
      { role }
    );
    return response.data;
  },
};
