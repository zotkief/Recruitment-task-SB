import axios from "axios";

import type {
  Contact,
  ContactFormData,
  ContactFilters,
  ContactStatus,
  ContactWithWeather,
} from "../types/contact.ts";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getContacts(
  filters?: ContactFilters,
): Promise<ContactWithWeather[]> {
  const response = await api.get<ContactWithWeather[]>("/contacts/", {
    params: filters,
  });

  return response.data;
}

export async function getStatuses(): Promise<ContactStatus[]> {
  const response = await api.get<ContactStatus[]>("/statuses/");

  console.log("Statuses response:", response.data);

  return response.data;
}

export async function createContact(data: ContactFormData): Promise<Contact> {
  const response = await api.post<Contact>("/contacts/", data);

  return response.data;
}

export async function updateContact(
  id: number,
  data: ContactFormData,
): Promise<Contact> {
  const response = await api.put<Contact>(`/contacts/${id}/`, data);

  return response.data;
}

export async function deleteContact(id: number): Promise<void> {
  await api.delete(`/contacts/${id}/`);
}

export async function importContacts(file: File): Promise<void> {
  const formData = new FormData();

  formData.append("file", file);

  await api.post("/contacts/import/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
