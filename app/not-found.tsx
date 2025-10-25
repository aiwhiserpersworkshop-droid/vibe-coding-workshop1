import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-4xl font-bold text-white mb-4">404</h2>
      <p className="text-lg text-gray-400 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
