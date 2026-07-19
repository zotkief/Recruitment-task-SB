import type { ContactFilters, ContactStatus } from "../types/contact";

interface SearchBarProps {
  filters: ContactFilters;
  statuses: ContactStatus[];
  onChange: (filters: ContactFilters) => void;
}

export default function SearchBar({
  filters,
  statuses,
  onChange,
}: SearchBarProps) {
  return (
    <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value,
            })
          }
          className="rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="text"
          placeholder="City"
          value={filters.city ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              city: e.target.value,
            })
          }
          className="rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
        />

        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All statuses</option>

          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>

        <select
          value={filters.ordering ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              ordering: e.target.value || undefined,
            })
          }
          className="rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Default sorting</option>

          <option value="last_name">Last name ↑</option>

          <option value="-last_name">Last name ↓</option>

          <option value="created_at">Created ↑</option>

          <option value="-created_at">Created ↓</option>
        </select>
      </div>
    </div>
  );
}
