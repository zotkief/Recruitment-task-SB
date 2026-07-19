import ContactRow from "./ContactRow";

import type { Contact, ContactWithWeather } from "../types/contact";

interface ContactTableProps {
  contacts: ContactWithWeather[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export default function ContactTable({
  contacts,
  onEdit,
  onDelete,
}: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500 shadow-sm">
        No contacts found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Contact
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>

            <th className="px-4 py-3 text-left text-sm font-semibold">City</th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Weather
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Created
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((item) => (
            <ContactRow
              key={item.contact.id}
              data={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
