import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  ticketPrice: string;
  location: string;
  category: string;
  distanceFromCity: string;
  distanceFromAirport: string;
  openHours: string;
  gallery: string[];
}

export const api = {
  destinations: {
    getAll: async (): Promise<Destination[]> => {
      const response = await axios.get(`${API_URL}/destinations`);
      return response.data;
    },

    getById: async (id: number): Promise<Destination> => {
      const response = await axios.get(`${API_URL}/destinations/${id}`);
      return response.data;
    },

    getByCategory: async (category: string): Promise<Destination[]> => {
      const response = await axios.get(`${API_URL}/destinations`, {
        params: { category },
      });
      return response.data;
    },

    getByLocation: async (location: string): Promise<Destination[]> => {
      const response = await axios.get(`${API_URL}/destinations`, {
        params: { location },
      });
      return response.data;
    },
  },
};
