import React, { useState } from 'react';
import { FaSearch, FaUser, FaCheckCircle, FaExclamationTriangle, FaTrophy } from 'react-icons/fa';
import { MdOutlineDataArray } from 'react-icons/md'; 
const SearchProfile = () => {
  const [userId, setUserId] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // You will need to replace this with your actual API endpoint URL
  const API_ENDPOINT = '/api/users/solved-problems'; 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter a User ID.');
      setProfileData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The API expects the ID in the request body as _id
        body: JSON.stringify({ _id: userId }), 
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Handle API errors (e.g., 404 User not found, 400 Invalid ID)
        setError(data.message || 'Failed to fetch user profile.');
        setProfileData(null);
        return;
      }

      setProfileData(data);
    } catch (err) {
      console.error('Network or parsing error:', err);
      setError('Could not connect to the server or an unknown error occurred.');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderDifficultyStats = (stats) => (
    <div className="grid grid-cols-4 gap-4 text-center mt-6 p-4 bg-slate-800 rounded-lg shadow-inner">
      <StatBox label="Easy" count={stats.easy} color="text-green-400" />
      <StatBox label="Medium" count={stats.medium} color="text-yellow-400" />
      <StatBox label="Hard" count={stats.hard} color="text-red-400" />
      <StatBox label="Points" count={stats.solvedPoin} color="text-violet-400" icon={<FaTrophy />} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 mb-8">
          User Profile Search 
        </h1>

        {/* --- Search Bar --- */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-10 p-6 bg-slate-800/80 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="relative flex-grow">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID (_id) to search profile..."
              className="w-full py-3 pl-12 pr-4 bg-slate-700 border border-slate-600 rounded-lg text-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-300"
            />
            <FaFingerprint className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-400 text-xl" />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:opacity-95 disabled:opacity-50 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Searching...' : <><FaSearch /> Search</>}
          </button>
        </form>

        {/* --- Loading/Error/Results Display --- */}
        {loading && (
          <div className="text-center text-lg text-violet-400 flex items-center justify-center p-10">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 016 12H2c0 3.042 1.135 5.824 3 7.938l1-2.647z"></path>
            </svg>
            Loading profile data...
          </div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
            <FaExclamationTriangle className="text-2xl" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {profileData && (
          <div className="bg-slate-800 rounded-xl p-8 shadow-2xl">
            {/* Profile Summary */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
                <FaUser className="text-violet-400" />
                {profileData.displayName || 'Unnamed User'}
              </h2>
              <span className="text-2xl font-semibold text-green-400 flex items-center gap-2">
                <FaCheckCircle /> {profileData.solvedProblemsCount} Solved
              </span>
            </div>

            {/* Difficulty Statistics */}
            {renderDifficultyStats(profileData.difficultyStats)}
            
            {/* Solved Problems List */}
            <h3 className="text-2xl font-semibold mt-8 mb-4 border-b border-slate-700 pb-2 text-violet-300">
              Problems List
            </h3>
            
            {profileData.solvedProblems.length > 0 ? (
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                {profileData.solvedProblems.map((problem) => (
                  <li 
                    key={problem._id} 
                    className="flex justify-between items-center p-3 bg-slate-700/70 hover:bg-slate-700 rounded-lg transition duration-200"
                  >
                    <div className="flex items-center gap-3">
                        <MdOutlineDataArray className="text-xl text-cyan-400" />
                        <span className="font-medium text-gray-200">{problem.title || 'Untitled Problem'}</span>
                    </div>
                    {/* Assuming your problem model has difficulty and points, which are populated */}
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-700/50 text-green-400' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-700/50 text-yellow-400' :
                        'bg-red-700/50 text-red-400'
                    }`}>
                        {problem.difficulty || 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 italic p-4 bg-slate-700/50 rounded-lg">
                This user has not solved any problems yet.
              </p>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper Component for Statistics Display ---
const StatBox = ({ label, count, color, icon }) => (
  <div className="p-3 bg-slate-900 rounded-md">
    <div className={`text-3xl font-bold ${color} flex items-center justify-center`}>
      {icon || <FaCheckCircle />} {count}
    </div>
    <div className="text-sm font-medium text-slate-400 mt-1">{label}</div>
  </div>
);

export default SearchProfile;