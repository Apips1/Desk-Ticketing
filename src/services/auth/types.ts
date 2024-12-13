import { IdName } from "@/types/common";
import { Response } from "@/types/response";

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  company: IdName;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthLoginResponse
  extends Response<{ token: string; user: AuthUser }> {}

export interface AuthMeResponse extends Response<AuthUser> {}
