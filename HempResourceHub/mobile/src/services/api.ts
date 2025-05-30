import axios from 'axios';

// API Base URL - Update this to match your server's URL
// For development, use your computer's IP address instead of localhost
// Example: 'http://192.168.1.100:5000/api' or 'https://your-domain.com/api'
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on your existing schema
export interface PlantType {
  id: number;
  name: string;
  description: string | null;
}

export interface Industry {
  id: number;
  name: string;
  description: string | null;
}

export interface HempProduct {
  id: number;
  name: string;
  description: string | null;
  plantPartId: number;
  industryId: number;
  subIndustryId: number | null;
  sustainabilityScore: number | null;
  economicValue: string | null;
  applications: string[] | null;
}

export interface ResearchPaper {
  id: number;
  title: string;
  authors: string;
  journal: string | null;
  publicationDate: string | null;
  doi: string | null;
  abstract: string | null;
  plantTypeId: number | null;
  plantPartId: number | null;
  industryId: number | null;
  citations: number | null;
  keywords: string[] | null;
}

export interface Stats {
  totalProducts: string;
  totalIndustries: number;
  totalResearchPapers: string;
}

// API Service functions
export const apiService = {
  // Plant Types
  getPlantTypes: async (): Promise<PlantType[]> => {
    const response = await api.get('/plant-types');
    return response.data;
  },

  getPlantType: async (id: number): Promise<PlantType> => {
    const response = await api.get(`/plant-types/${id}`);
    return response.data;
  },

  // Industries
  getIndustries: async (): Promise<Industry[]> => {
    const response = await api.get('/industries');
    return response.data;
  },

  getIndustry: async (id: number): Promise<Industry> => {
    const response = await api.get(`/industries/${id}`);
    return response.data;
  },

  // Hemp Products
  getHempProducts: async (): Promise<HempProduct[]> => {
    const response = await api.get('/hemp-products');
    return response.data;
  },

  getHempProduct: async (id: number): Promise<HempProduct> => {
    const response = await api.get(`/hemp-products/${id}`);
    return response.data;
  },

  getHempProductsByIndustry: async (industryId: number): Promise<HempProduct[]> => {
    const response = await api.get(`/hemp-products/industry/${industryId}`);
    return response.data;
  },

  searchHempProducts: async (query: string): Promise<HempProduct[]> => {
    const response = await api.get(`/hemp-products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Research Papers
  getResearchPapers: async (): Promise<ResearchPaper[]> => {
    const response = await api.get('/research-papers');
    return response.data;
  },

  getResearchPaper: async (id: number): Promise<ResearchPaper> => {
    const response = await api.get(`/research-papers/${id}`);
    return response.data;
  },

  getResearchPapersByIndustry: async (industryId: number): Promise<ResearchPaper[]> => {
    const response = await api.get(`/research-papers/industry/${industryId}`);
    return response.data;
  },

  searchResearchPapers: async (query: string): Promise<ResearchPaper[]> => {
    const response = await api.get(`/research-papers/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Statistics
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default apiService;