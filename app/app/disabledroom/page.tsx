"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const ClosedRoomPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 mx-4">
    <h1 className="text-4xl font-bold mb-4 text-center">Room Closed</h1>
    <p className="text-lg mb-8 text-center">The room you were in has been closed. Please return to the homepage.</p>
    <button
      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-lg font-medium"
      onClick={handleGoHome}
    >
      Go to Home
    </button>
  </div>
);
};

export default ClosedRoomPage;
