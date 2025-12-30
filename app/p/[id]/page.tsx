import { notFound } from "next/navigation";
import { viewPaste } from "@/app/lib/services/paste.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  const paste = await viewPaste(id);

  if (!paste) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Paste</h1>
          <div className="text-sm text-gray-400 space-y-1">
            {paste.expires_at && (
              <p>Expires: {new Date(paste.expires_at).toLocaleString()}</p>
            )}
            {paste.remaining_views !== null && (
              <p>Remaining views: {paste.remaining_views}</p>
            )}
          </div>
        </header>

        <main>
          {/* Content is safely rendered in a <pre> tag - React escapes text content by default */}
          <pre className="bg-gray-800 rounded-lg p-6 overflow-x-auto text-sm font-mono whitespace-pre-wrap break-words border border-gray-700">
            {paste.content}
          </pre>
        </main>

        <footer className="mt-6 text-center text-gray-500 text-sm">
          <p>Pastebin Lite</p>
        </footer>
      </div>
    </div>
  );
}
