import axios from "axios";
import { IRegisterInput, ILoginInput, IAuthResponse, IProfileResponse, ApiResponse, IUser } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  async register(data: IRegisterInput): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>("/auth/register", data);
    return response.data;
  },

  async login(data: ILoginInput): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>("/auth/login", data);
    return response.data;
  },

  async getProfile(): Promise<IProfileResponse> {
    const response = await api.get<IProfileResponse>("/auth/profile");
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    photo?: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    skills?: string[];
  }): Promise<ApiResponse<IUser>> {
    const response = await api.patch<ApiResponse<IUser>>("/auth/profile", data);
    return response.data;
  },

  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      // Also set cookie for middleware auth check (7 days)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // Also remove cookie
      document.cookie = "token=; path=/; max-age=0";
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
