const BASE_URL = 'http://localhost:3000/api';

export async function fetchClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers, 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}