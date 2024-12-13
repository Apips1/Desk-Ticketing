import { P } from "@/types/response";

export type ResponseListCompany = P<DataCompany>;

export interface DataCompany {
  id: string;
  company: Company;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
}

export interface Validation {}
