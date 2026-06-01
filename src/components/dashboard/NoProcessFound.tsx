import { Table } from "lucide-react";

const NoProcessFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 p-8">
      <Table className="w-10 h-10 mb-2" />
      <p className="text-sm font-medium">No Process found</p>
    </div>
  );
};

export default NoProcessFound;
