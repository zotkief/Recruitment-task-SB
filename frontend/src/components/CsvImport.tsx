import { useState } from "react";

interface CsvImportProps {
  onImport: (file: File) => Promise<void>;
}

export default function CsvImport({ onImport }: CsvImportProps) {
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Only CSV files are allowed.");

      setFile(null);

      return;
    }

    setError("");

    setFile(selectedFile);
  }

  async function handleImport() {
    if (!file) {
      setError("Please select a CSV file.");

      return;
    }

    try {
      setIsLoading(true);

      await onImport(file);

      setFile(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">Import contacts</h3>

      <div className="flex flex-col gap-3">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
        />

        <button
          type="button"
          disabled={isLoading}
          onClick={handleImport}
          className="w-full rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? "Importing..." : "Import"}
        </button>
      </div>

      {file && (
        <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
