export type UserRole = "user" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  photo?: string;
  role: UserRole;
  skills: string[];
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  photo?: string;
  skills?: string[];
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<IUser, "password">;
    token: string;
  };
}

export interface IProfileResponse {
  success: boolean;
  data?: Omit<IUser, "password">;
  message?: string;
}
