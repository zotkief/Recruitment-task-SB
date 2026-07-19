import { useState } from "react";

import type { Contact, ContactFormData, ContactStatus } from "../types/contact";

interface ContactFormProps {
  initialData?: Contact;
  statuses: ContactStatus[];
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
}

export default function ContactForm({
  initialData,
  statuses,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: initialData?.first_name ?? "",
    last_name: initialData?.last_name ?? "",
    phone_number: initialData?.phone_number ?? "",
    email: initialData?.email ?? "",
    city: initialData?.city ?? "",
    status_id: initialData?.status.id ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(field: keyof ContactFormData, value: string | number) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format.";
    }

    if (formData.phone_number.length < 9) {
      newErrors.phone_number = "Phone number is too short.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.status_id) {
      newErrors.status_id = "Status is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
      city: formData.city.trim(),
      phone_number: formData.phone_number.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">First name</label>

        <input
          value={formData.first_name}
          onChange={(event) => updateField("first_name", event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Last name</label>

        <input
          value={formData.last_name}
          onChange={(event) => updateField("last_name", event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Phone number</label>

        <input
          value={formData.phone_number}
          onChange={(event) => updateField("phone_number", event.target.value)}
          className="w-full rounded border px-3 py-2"
        />

        {errors.phone_number && (
          <p className="text-sm text-red-600">{errors.phone_number}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>

        <input
          type="email"
          value={formData.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="w-full rounded border px-3 py-2"
        />

        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">City</label>

        <input
          value={formData.city}
          onChange={(event) => updateField("city", event.target.value)}
          className="w-full rounded border px-3 py-2"
        />

        {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>

        <select
          value={formData.status_id}
          onChange={(event) =>
            updateField("status_id", Number(event.target.value))
          }
          className="w-full rounded border px-3 py-2"
        >
          <option value={0}>Select status</option>

          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>

        {errors.status_id && (
          <p className="text-sm text-red-600">{errors.status_id}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}
