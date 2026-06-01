import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 overflow-hidden">
      {/* Decorative SVG Blob - Positioned behind everything */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl opacity-50 z-0">
        <svg
          className="w-full h-auto text-indigo-100"
          fill="currentColor"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,72.1,40.1C62.8,51.1,49.8,58.5,36.8,64.8C23.8,71.1,10.9,76.3,-2.4,80.4C-15.7,84.5,-31.3,87.6,-44.8,82.3C-58.3,77,-69.6,63.3,-76.6,48.5C-83.6,33.7,-86.3,17.9,-84.4,2.9C-82.5,-12.1,-76,-26.3,-67.4,-38.7C-58.8,-51.1,-48.1,-61.7,-35.7,-69.8C-23.3,-77.9,-11.7,-83.5,2.1,-87.1C15.8,-90.7,30.7,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Content Container - Set to z-10 to sit above the blob */}
      <div className="text-center z-10">
        {/* Big Stylized 404 */}
        <h1 className="text-9xl font-black text-red-200/80 tracking-widest relative">
          404
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 text-2xl md:text-4xl whitespace-nowrap">
            Page Not Found
          </span>
        </h1>

        {/* Descriptive Text */}
        <div className="mt-8">
          <p className="text-2xl font-semibold text-gray-800 md:text-3xl">
            Oops! You've ventured into the unknown.
          </p>
          <p className="mt-4 text-gray-500 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved. Don't
            worry, even the best explorers get lost sometimes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 duration-200"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 border border-gray-300 bg-white/50 backdrop-blur-sm text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
