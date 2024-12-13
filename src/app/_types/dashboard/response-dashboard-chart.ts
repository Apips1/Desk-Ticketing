import { R } from "@/types/response";

export type ResponseDashboardChart = R<Data> 

export interface Data {
  friday:    Day;
  monday:    Day;
  saturday:  Day;
  thursday:  Day;
  tuesday:   Day;
  wednesday: Day;
}

export interface Day {
  close: number;
  open:  number;
  dayName: string;
}

export interface Validation {
}
