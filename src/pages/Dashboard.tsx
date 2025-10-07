const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 md:p-12 text-center max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          We're preparing something awesome for you!
        </p>
        <p className="text-md text-gray-500 italic">
          Check back soon for updates.
        </p>
        {/* Removed the spinning loader */}
      </div>
    </div>
  );
};

export default Dashboard;
