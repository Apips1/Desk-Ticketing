import { P } from "@/types/response";
import { Attachment } from "./response-detail-ticket";

export type ResponseListComment = P<ListCommentData>; 

export interface ListCommentData {
  id:          string;
  company:     Agent;
  product:     Agent;
  ticket:      Ticket;
  agent:       Agent;
  customer:    Agent;
  sender:      string;
  content:     string;
  attachments: Attachment[];
  createdAt:   string;
  updatedAt:   string;
}
export interface Agent {
  id?:   string;
  name?: string;
}
export interface Ticket {
  id:      string;
  subject: string;
}

export interface Validation {
}
