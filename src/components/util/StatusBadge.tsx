import React, { type JSX } from "react";

export interface StatusBadgeProps {
  status:
    | "Success"
    | "Pass"
    | "Processing"
    | "Fail"
    | "Pending"
    | "Downloading"
    | "Uploading"
    | "Running Tasks";
  errDescription?: string | null;
}

const statusIcons: Record<StatusBadgeProps["status"], JSX.Element> = {
  Success: (
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Pass: (
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Processing: (
    <svg
      className="w-4 h-4 mr-2 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  ),
  Fail: (
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Pending: (
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Downloading: (
    <svg
      className="w-4 h-4 mr-2 animate-pulse orange-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M5.23 7.21a1 1 0 011.4-.02L10 10.17l3.38-2.98a1 1 0 011.32 1.5l-4 3.5a1 1 0 01-1.34 0l-4-3.5a1 1 0 01-.13-1.48z" />
    </svg>
  ),
  Uploading: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 h-5 mr-2 text-orange-500 animate-bounce"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  "Running Tasks": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-5 h-5 mr-2 text-orange-500 animate-spin"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </svg>
  ),
};

const statusColor: Record<StatusBadgeProps["status"], string> = {
  Success: "text-green-800",
  Pass: "text-green-800",
  Processing: "text-blue-800",
  Fail: "text-red-800",
  Pending: "text-yellow-800",
  Downloading: "text-orange-500",
  Uploading: "text-orange-500",
  "Running Tasks": "text-orange-500",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  errDescription,
}) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        statusColor[status]
      } ${status === "Success" && errDescription && "border border-red-500"}`}
    >
      {statusIcons[status]}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
