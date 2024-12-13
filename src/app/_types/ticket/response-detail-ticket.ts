import { R } from "@/types/response";

export type ResponseDetailTicket = R<DetailTicketData>
export interface DetailTicketData {
  id:           string;
  company:      Company;
  product:      Company;
  customer:     Customer;
  subject:      string;
  content:      string;
  code:         string;
  attachments:  Attachment[];
  logTime:      LogTime;
  priority:     string;
  status:       string;
  reminderSent: boolean;
  detailTime:   DetailTime;
  parent:       null;
  closedAt:     null;
  createdAt:    string;
  updatedAt:    string;
}

export interface Attachment {
  id:          string;
  name:        string;
  size:        number;
  url:         string;
  type:        string;
  isPrivate?:   boolean;
  providerKey?: string;
}

export interface Company {
  id:   string;
  name: string;
}

export interface Customer {
  id:    string;
  name:  string;
  email: string;
}

export interface DetailTime {
  year:    number;
  month:   number;
  day:     number;
  dayName: string;
}

export interface LogTime {
  startAt:                     string;
  endAt:                       null;
  durationInSeconds:           number;
  pauseDurationInSeconds:      number;
  status:                      string;
  totalDurationInSeconds:      number;
  totalPauseDurationInSeconds: number;
  pauseHistory:                PauseHistory[];
}

export interface PauseHistory {
  pausedAt:       string;
  resumedAt:      string | null;
  durationActive: number;
}

export interface Validation {
}

export type P<T> = {
  data: {
    list: T[];
  };
  meta: {
    totalPages: number;
    currentPage: number;
  };
};
