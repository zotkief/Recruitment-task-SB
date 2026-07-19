import { useEffect, useState } from "react";

import SearchBar from "../components/SearchBar";
import ContactTable from "../components/ContactTable";
import ContactModal from "../components/ContactModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import CsvImport from "../components/CsvImport";
import { AxiosError } from "axios";

import type {
  Contact,
  ContactFormData,
  ContactFilters,
  ContactStatus,
  ContactWithWeather,
} from "../types/contact";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
  getStatuses,
} from "../api/contacts";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactWithWeather[]>([]);

  const [statuses, setStatuses] = useState<ContactStatus[]>([]);

  const [filters, setFilters] = useState<ContactFilters>({});

  const [isLoading, setIsLoading] = useState(false);

  // Same modal is reused for creating and editing contacts.
  // Null value means that the modal is in create mode.
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadContacts() {
    try {
      setIsLoading(true);

      const data = await getContacts(filters);

      setContacts(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStatuses() {
    const data = await getStatuses();

    setStatuses(data);
  }

  // Statuses are loaded once because they are used as options
  // in contact forms and filters.
  useEffect(() => {
    loadStatuses();
  }, []);

  useEffect(() => {
    loadContacts();
  }, [filters]);

  async function handleCreate(data: ContactFormData) {
    setErrorMessage(null);

    try {
      await createContact(data);

      closeModal();

      await loadContacts();
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response?.data;

        if (response?.error) {
          setErrorMessage(response.error);
        } else {
          const firstField = Object.keys(response ?? {})[0];

          if (firstField) {
            setErrorMessage(response[firstField][0]);
          } else {
            setErrorMessage("Failed to create contact.");
          }
        }

        return;
      }

      setErrorMessage("Unexpected error.");
    }
  }

  async function handleUpdate(data: ContactFormData) {
    if (!selectedContact) {
      return;
    }

    setErrorMessage(null);

    try {
      await updateContact(selectedContact.id, data);

      closeModal();

      await loadContacts();
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response?.data;

        if (response?.error) {
          setErrorMessage(response.error);
        } else {
          const firstField = Object.keys(response ?? {})[0];

          if (firstField) {
            setErrorMessage(response[firstField][0]);
          } else {
            setErrorMessage("Failed to create contact.");
          }
        }

        return;
      }

      setErrorMessage("Unexpected error.");
    }
  }

  async function handleDelete() {
    if (!contactToDelete) {
      return;
    }

    await deleteContact(contactToDelete.id);

    setContactToDelete(null);

    await loadContacts();
  }

  async function handleImport(file: File) {
    await importContacts(file);

    await loadContacts();
  }

  function openCreateModal() {
    setSelectedContact(null);
    setErrorMessage(null);

    setIsModalOpen(true);
  }

  function openEditModal(contact: Contact) {
    setSelectedContact(contact);
    setErrorMessage(null);

    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedContact(null);
    setErrorMessage(null);

    setIsModalOpen(false);
  }

  return (
    <div>
      <div className="bg-primary flex items-center justify-between px-6 py-4">
        <h1 className="font-inter text-3xl font-bold text-white">CONTACTS</h1>
      </div>
      <div className="flex flex-col gap-6 p-4 lg:flex-row">
        <div>
          <SearchBar
            filters={filters}
            statuses={statuses}
            onChange={setFilters}
          />

          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <ContactTable
              contacts={contacts}
              onEdit={openEditModal}
              onDelete={setContactToDelete}
            />
          )}

          <ContactModal
            isOpen={isModalOpen}
            contact={selectedContact ?? undefined}
            statuses={statuses}
            error={errorMessage ?? undefined}
            onSubmit={selectedContact ? handleUpdate : handleCreate}
            onClose={closeModal}
          />

          <ConfirmDeleteModal
            isOpen={!!contactToDelete}
            contact={contactToDelete ?? undefined}
            onClose={() => setContactToDelete(null)}
            onConfirm={handleDelete}
          />
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <button
              onClick={openCreateModal}

              className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Add contact
            </button>
          </div>

          <CsvImport onImport={handleImport} />
        </div>
      </div>
    </div>
  );
}
