import { useNavigate } from 'react-router-dom';
import profilePhoto from '../assets/profile.jpg';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <span>&#8592;</span> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">About</h1>
        <div className="flex justify-center mb-6">
          <img
            src={profilePhoto}
            alt="Developer"
            className="w-32 h-32 rounded-full ring-4 ring-indigo-100 object-cover"
          />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Developer</p>
            <p className="text-lg font-semibold text-gray-800">Pisute Chen</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Age</p>
            <p className="text-gray-700">19</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
            <a
              href="mailto:pisute.che@student.mahidol.ac.th"
              className="text-indigo-600 hover:underline"
            >
              pisute.che@student.mahidol.ac.th
            </a>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
            <p className="text-gray-700">0970985753</p>
          </div>
        </div>
      </div>
    </div>
  );
}
