import {
  DefaultError,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface Err extends AxiosResponse<DefaultError> {}

export interface ServiceMutationConfig<Res = unknown, Var = unknown> {
  axios?: AxiosRequestConfig;
  query?: UseMutationOptions<Res, Err, Var>;
}

export interface ServiceConfig<Res = unknown> {
  axios?: AxiosRequestConfig;
  query?: UseQueryOptions<Res, Err>;
}

export const API = {
  AUTH: {
    LOGIN: `/agent/auth/login`,
    GET_ME: `/agent/auth/me`,
  },
  DASHBOARD: {
    DASHBOARD: `/agent/dashboard/total-ticket`,
    TOTAL_TICKET: `/agent/dashboard/total-ticket-now`,
    TOTAL_TICKET_NOW: `/agent/dashboard`,
  },
  TICKET: {
    COMMENT: {
      CREATE: `/agent/ticket/comments/add`,
      DETAIL: (id: string) => `/agent/ticket/comments/detail/${id}`,
      LIST: (id: string) => `/agent/ticket/comments/list/${id}`,
    },
    TIME_LOG: {
      LIST: `/agent/ticket/list`,
    },
    LIST: `/agent/ticket/list`,
    DETAIL: (id: string) => `/agent/ticket/list/${id}`,
    CLOSE: `/agent/ticket/close`,
    REOPEN: `/agent/ticket/reopen`,
    START_LOG: `/agent/ticket/logging/start`,
    RESUME_LOG: `/agent/ticket/logging/resume`,
    PAUSE_LOG: () => `/agent/ticket/logging/pause`,
    STOP_LOG: () => `/agent/ticket/logging/stop`,
    UPLOAD_ATTACHMENT: `/agent/attachment/upload`,
    UPDATE_TIME_TRACK: (id: string) => `/agent/ticket/time-track/update/${id}`,
    EXPORT_CSV: `/agent/ticket/export-csv`,
    ASSIGN_TO_ME: (id: string) => `/agent/ticket/assign-me/${id}`,
  },
  ATTACHMENT: {
    UPLOAD: `/agent/attachment/upload`,
    DETAIL: (id: string) => `/agent/attachment/detail`,
  },
  COMPANY_PRODUCT: {
    LIST: `/agent/company-product/list`,
    DETAIL: (id: string) => `/agent/company-product/detail/${id}`,
    CREATE: `/agent/company-product/create`,
    UPDATE: (id: string) => `/agent/company-product/update/${id}`,
    DELETE: (id: string) => `/agent/company-product/delete/${id}`,
    UPLOAD_LOGO: (id: string) => `/agent/company-product/upload-logo/${id}`,
  },
};
