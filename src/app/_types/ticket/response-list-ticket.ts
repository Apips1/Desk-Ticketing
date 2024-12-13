import { P } from "@/types/response";
import { Attachment, Customer } from "./response-detail-ticket";

export type ResponseListTicket = P<ListTicketDatum>

export interface ListTicketDatum{
  id:          string;
  company:     Company;
  product:     Company;
  customer:    Customer;
  subject:     string;
  content:     string;
  attachments: Attachment | null;
  logTime:     LogTime;
  priority:    string;
  status:      string;
  createdAt:   string;
  updatedAt:   string;
  deletedAt:   null;
  closedAt:   string | null;
  code: string;
}

export interface Company {
  id:   string;
  name: string;
}

export interface LogTime {
  startAt:           string | null;
  endAt:             string | null;
  durationInSeconds: number;
  status:            string;
}

export interface Validation {
}

