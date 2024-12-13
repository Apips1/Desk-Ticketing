import { R } from "@/types/response";

export type ResponseUploadAttachment = R<UploadAttachmentData>

export interface UploadAttachmentData {
  id:          string;
  company:     Company;
  name:        string;
  provider:    string;
  providerKey: string;
  type:        string;
  size:        number;
  url:         string;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface Company {
  id:   string;
  name: string;
}

export interface Validation {
}
