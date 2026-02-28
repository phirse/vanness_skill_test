import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <p className="text-xl text-gray-600 mt-2">Page not found</p>
        <Link to="/dashboard" className="mt-6 inline-block text-indigo-600 hover:underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
