import { R } from "@/types/response";

export type ResponseDashboard = R<Data>;

export interface Data {
  total_ticket:        number;
  total_ticket_closed: number;
  total_ticket_open:   number;
}

export interface Validation {
}
