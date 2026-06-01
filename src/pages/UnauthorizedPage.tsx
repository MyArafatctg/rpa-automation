import React from "react";
import { Lock, ArrowLeft, Home } from "lucide-react"; // Optional: Install lucide-react for icons

const UnauthorizedPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Illustration/Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-sm border border-gray-100">
              <Lock className="w-16 h-16 text-red-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Access Denied
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, you don't have the required permissions to view this page.
          Please contact your administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </a>
        </div>

        {/* Footer/Help Link */}
        <p className="mt-10 text-sm text-gray-400">
          Error Code:{" "}
          <span className="font-mono font-semibold text-gray-500">
            403_FORBIDDEN
          </span>
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
