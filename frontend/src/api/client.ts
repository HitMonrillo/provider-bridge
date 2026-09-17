import axios from 'axios';

const API_BASE_URL = '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  preferredLanguage: string;
  createdAt: string;
}

export interface Provider {
  id: number;
  name: string;
  organization: string;
  country: string;
  email: string;
  phone?: string;
  whatsApp?: string;
  timezone: string;
  createdAt: string;
}

export interface Request {
  id: number;
  patientId: number;
  providerId: number;
  description: string;
  status: string;
  bilingSummaryEn?: string;
  bilingSummaryPt?: string;
  createdAt: string;
  resolvedAt?: string;
  patient?: Patient;
  provider?: Provider;
}

export interface OutreachAttempt {
  id: number;
  requestId: number;
  channel: string;
  message?: string;
  sentAt: string;
  responseReceived: boolean;
  responseMessage?: string;
  responseReceivedAt?: string;
}

// Patients
export const getPatients = () => client.get<Patient[]>('/patients');
export const createPatient = (data: { name: string; dateOfBirth: string; preferredLanguage: string }) =>
  client.post<Patient>('/patients', data);

// Providers
export const getProviders = () => client.get<Provider[]>('/providers');
export const createProvider = (data: Omit<Provider, 'id' | 'createdAt'>) =>
  client.post<Provider>('/providers', data);

// Requests
export const getRequests = () => client.get<Request[]>('/requests');
export const createRequest = (data: { patientId: number; providerId: number; description: string }) =>
  client.post<Request>('/requests', data);
export const updateRequestStatus = (id: number, status: string) =>
  client.patch<Request>(`/requests/${id}/status`, { status });
export const getOutreachAttempts = (requestId: number) =>
  client.get<OutreachAttempt[]>(`/requests/${requestId}/outreach-attempts`);
export const checkOverdue = () =>
  client.post('/requests/check-overdue');
