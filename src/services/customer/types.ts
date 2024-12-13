export interface CompanyProductLogo {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  isPrivate: boolean;
  providerKey: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface CompanyProduct {
  id: string;
  company: Company;
  name: string;
  code: string;
  logo: CompanyProductLogo;
  ticketTotal: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string | null;
}

export interface CompanyProductListResponse {
  status: number;
  message: string;
  validation: Record<string, unknown>;
  data: {
    list: CompanyProduct[];
    limit: number;
    page: number;
    total: number;
  };
}
