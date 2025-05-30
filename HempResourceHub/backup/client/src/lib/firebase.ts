// Mock Firebase configuration and initialization
// In a real application, this would use actual Firebase SDK

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hempdb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hempdb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hempdb.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789",
};

class MockFirebase {
  constructor() {
    console.log("Firebase initialized with config:", firebaseConfig);
  }
  
  async getPlantTypes() {
    // In a real implementation, this would fetch data from Firebase
    const response = await fetch('/api/plant-types');
    return response.json();
  }
  
  async getPlantType(id: number) {
    const response = await fetch(`/api/plant-types/${id}`);
    return response.json();
  }
  
  async getPlantPartsByType(plantTypeId: number) {
    const response = await fetch(`/api/plant-parts?plantTypeId=${plantTypeId}`);
    return response.json();
  }
  
  async getPlantPart(id: number) {
    const response = await fetch(`/api/plant-parts/${id}`);
    return response.json();
  }
  
  async getHempProductsByPart(plantPartId: number, industryId?: number, page: number = 1, limit: number = 5) {
    let url = `/api/hemp-products?pagination=true&page=${page}&limit=${limit}&plantPartId=${plantPartId}`;
    if (industryId) {
      url += `&industryId=${industryId}`;
    }
    const response = await fetch(url);
    return response.json();
  }
  
  async getHempProduct(id: number) {
    const response = await fetch(`/api/hemp-products/${id}`);
    return response.json();
  }
  
  async getAllIndustries() {
    const response = await fetch('/api/industries');
    return response.json();
  }
  
  async searchHempProducts(query: string) {
    const response = await fetch(`/api/hemp-products/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }
  
  async getStats() {
    const response = await fetch('/api/stats');
    return response.json();
  }
}

export const firebase = new MockFirebase();
