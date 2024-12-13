import { R } from "@/types/response";

export type ResponseAttachment = R<Data>;

export interface Data {
  id:           string;
  company:      Company;
  name:         string;
  provider:     string;
  providerKey:  string;
  type:         string;
  size:         number;
  url:          string;
  expiredUrlAt: Date;
  isUsed:       boolean;
  isPrivate:    boolean;
  createdAt:    Date;
  updatedAt:    Date;
}

export interface Company {
  id:   string;
  name: string;
}

export interface Validation {}
