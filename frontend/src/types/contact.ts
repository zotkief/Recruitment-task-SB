export interface ContactStatus {
  id: number;
  name: string;
}

export interface Contact {
  id: number;

  first_name: string;
  last_name: string;

  phone_number: string;
  email: string;

  city: string;

  status: ContactStatus;

  created_at: string;
}

export interface Weather {
  temperature: number;
  humidity: number;
  wind_speed: number;
}

export interface ContactWithWeather {
  contact: Contact;
  weather: Weather | null;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;

  phone_number: string;
  email: string;

  city: string;

  status_id: number;
}

export interface ContactFilters {
  search?: string;
  city?: string;
  status?: number;
  ordering?: string;
}

export interface ApiMessage {
  message: string;
}

export interface ApiError {
  [key: string]: string[];
}
