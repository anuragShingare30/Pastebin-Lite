"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface PasteFormData {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

interface PasteResponse {
  id: string;
  url: string;
}

export default function Home() {
  const [result, setResult] = useState<PasteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasteFormData>();

  const onSubmit = async (data: PasteFormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, unknown> = { content: data.content };
      
      if (data.ttl_seconds) {
        body.ttl_seconds = Number(data.ttl_seconds);
      }
      if (data.max_views) {
        body.max_views = Number(data.max_views);
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Failed to create paste");
        return;
      }

      setResult(json);
      reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Pastebin Lite</h1>
          <p className="text-gray-400 mt-2">
            Create and share text snippets with optional expiry
          </p>
        </header>

        {result ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              Paste Created!
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Paste ID
                </label>
                <code className="block bg-gray-900 p-2 rounded text-sm">
                  {result.id}
                </code>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Shareable URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.url}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(result.url)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
                >
                  View Paste
                </a>
                <button
                  onClick={handleCreateAnother}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6"
          >
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                id="content"
                rows={10}
                placeholder="Paste your text here..."
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm font-mono focus:border-blue-500 focus:outline-none"
                {...register("content", {
                  required: "Content is required",
                  validate: (value) =>
                    value.trim() !== "" || "Content cannot be empty",
                })}
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ttl_seconds"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Expire after (seconds)
                </label>
                <input
                  type="number"
                  id="ttl_seconds"
                  min="1"
                  placeholder="Optional (e.g., 3600 for 1 hour)"
                  className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 focus:outline-none"
                  {...register("ttl_seconds", {
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                />
                {errors.ttl_seconds && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.ttl_seconds.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="max_views"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Max views
                </label>
                <input
                  type="number"
                  id="max_views"
                  min="1"
                  placeholder="Optional (e.g., 10)"
                  className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 focus:outline-none"
                  {...register("max_views", {
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                />
                {errors.max_views && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.max_views.message}
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>
                Leave expiry fields empty for a paste that never expires and has
                unlimited views.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed py-3 rounded font-medium"
            >
              {isLoading ? "Creating..." : "Create Paste"}
            </button>
          </form>
        )}

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Pastebin Lite • Simple text sharing</p>
        </footer>
      </div>
    </div>
  );
}
