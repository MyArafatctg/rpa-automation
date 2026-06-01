import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[96%] flex flex-col transition-all duration-300 transform scale-100 opacity-100">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl capitalize font-bold text-gray-800">
            {title}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
            onClick={onClose}
          >
            <IoMdCloseCircle className="text-3xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
