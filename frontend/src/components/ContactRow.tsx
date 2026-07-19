import type { Contact, ContactWithWeather } from "../types/contact";

interface ContactRowProps {
  data: ContactWithWeather;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export default function ContactRow({
  data,
  onEdit,
  onDelete,
}: ContactRowProps) {
  const contact = data.contact;
  const weather = data.weather;

  // Format the creation date to a user-friendly format.
  const createdAt = new Date(contact.created_at).toLocaleDateString();

  return (
    <tr className="border-b transition hover:bg-gray-50">
      <td className="px-4 py-3">
        <div>
          <div className="font-medium">
            {contact.first_name} {contact.last_name}
          </div>

          <div className="text-sm text-gray-500">{contact.email}</div>
        </div>
      </td>

      <td className="px-4 py-3">{contact.phone_number}</td>

      <td className="px-4 py-3">{contact.city}</td>

      <td className="px-4 py-3">
        {weather ? (
          <div className="text-sm">
            <div>{weather.temperature}°C</div>

            <div className="text-gray-500">Humidity: {weather.humidity}%</div>

            <div className="text-gray-500">Wind: {weather.wind_speed} km/h</div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">No data</span>
        )}
      </td>

      <td className="px-4 py-3">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium whitespace-nowrap text-blue-700">
          {contact.status.name}
        </span>
      </td>

      <td className="px-4 py-3">{createdAt}</td>

      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            className="rounded bg-yellow-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-yellow-600"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(contact)}
            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
