import React from 'react';

export const MessageStatus = ({ status }) => {
  if (status?.read) {
    return (
      <svg className="w-4 h-4 text-blue-500" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
        <path stroke="currentColor" d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14M7 10.5L11.0757 14.5757C11.3101 14.8101 11.69 14.8101 11.9243 14.5757L22.5 4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  } else if (status?.delivered) {
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
        <path stroke="currentColor" d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14M7 10.5L11.0757 14.5757C11.3101 14.8101 11.69 14.8101 11.9243 14.5757L22.5 4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  } else if (status?.sent) {
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
        <path stroke="currentColor" d="M5 12.5L8.5 16L19 5.5" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  return null;
};
