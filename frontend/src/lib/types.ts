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
}

/** Client, served by GET /api/clients (backend data/clients.json) */
export interface Client {
  id: string;
  name: string;
  logo: string;
}
