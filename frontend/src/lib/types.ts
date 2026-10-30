/** Portfolio project, served by GET /api/projects (backend data/projects.json) */
export interface PortfolioProject {
  id: string;
  name: string;
  location: string;
  business: string;
  category: string;
  status: string;
  coverImage: string;
  gallery: string[];
  description: string;
  year: number | null;
  /** Client company the work was done for */
  company?: string;
  /** Company logo, e.g. /images/8.jpg; null shows the company's initials */
  logo?: string | null;
  /** Scope delivered, e.g. "1st to 12th Floor" or "218 Flats" */
  workDone?: string;
  /** e.g. "2023 – 2024" */
  period?: string;
}

/** Client, served by GET /api/clients (backend data/clients.json) */
export interface Client {
  id: string;
  name: string;
  logo: string;
}
