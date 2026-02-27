import axios from 'axios';

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const serverApi = (token: string) =>
  axios.create({
    baseURL: BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
