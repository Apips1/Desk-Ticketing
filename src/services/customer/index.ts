import { API, ServiceConfig } from "..";
import { CompanyProductListResponse } from "./types";

export * from "./types";

// Hook for fetching company product list with proper typing
export const useCompanyProductList = (
  config?: ServiceConfig<CompanyProductListResponse>,
) =>
  useHttp<CompanyProductListResponse>(API.COMPANY_PRODUCT.LIST, {
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

// Direct API call function
export const getCompanyProductList = () =>
  http.get<CompanyProductListResponse>(API.COMPANY_PRODUCT.LIST);

// Example usage with parameters (optional)
export const getCompanyProductListWithParams = (
  page: number = 1,
  limit: number = 10,
) =>
  http.get<CompanyProductListResponse>(API.COMPANY_PRODUCT.LIST, {
    params: {
      page,
      limit,
    },
  });
