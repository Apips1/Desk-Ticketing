import { R } from "@/types/response";

export type ResponseLogin = R< {
  token: string;
  user:  User;
}>

export interface User {
  id:         string;
  name:       string;
  email:      string;
  createdAt:  Date;
  updatedAt:  Date;
}

export interface Validation {
}