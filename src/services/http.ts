import axios from 'axios';
import Cookies from 'js-cookie';

// ── Token cookie helpers ────────────────────────────────────────────────────

const TOKEN_COOKIE = 'porsa_token';

export function getToken(): string | null {
  return Cookies.get(TOKEN_COOKIE) ?? null;
}

export function setToken(token: string, expiresInDays = 7): void {
  Cookies.set(TOKEN_COOKIE, token, {
    expires: expiresInDays,
    sameSite: 'strict',
    // secure: true — enable when deployed over HTTPS
  });
}

export function clearToken(): void {
  Cookies.remove(TOKEN_COOKIE);
}

// ── Axios instance ──────────────────────────────────────────────────────────

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Request interceptor — attach Bearer token from cookie automatically
http.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — normalise errors to plain Error with Farsi-friendly detail
http.interceptors.response.use(
  response => response,
  error => {
    const detail: string =
      error.response?.data?.detail ??
      error.message ??
      'خطای ناشناخته';
    return Promise.reject(new Error(String(detail)));
  },
);

export default http;
