import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-xl text-gray-300 mb-6">Paste Not Found</h2>
        <p className="text-gray-400 mb-8">
          This paste doesn&apos;t exist, has expired, or has reached its view limit.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
