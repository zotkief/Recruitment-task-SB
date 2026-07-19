import ContactForm from "./ContactForm";

import type { Contact, ContactFormData, ContactStatus } from "../types/contact";

interface ContactModalProps {
  isOpen: boolean;
  contact?: Contact;
  statuses: ContactStatus[];
  error?: string;

  onSubmit: (data: ContactFormData) => void;
  onClose: () => void;
}

export default function ContactModal({
  isOpen,
  contact,
  statuses,
  onSubmit,
  onClose,
  error,
}: ContactModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {contact ? "Edit contact" : "Add contact"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <ContactForm
          initialData={contact}
          statuses={statuses}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
