import React from 'react';

import CreateRoomButton from "@/components/CreateRoomButton";
import JoinRoomButton from "@/components/JoinRoom";

const page = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-green-400">Welcome to QuizVerse</h1>
        <p className="text-lg text-gray-400">Create or join a quiz room and challenge your friends!</p>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow space-y-6 w-full max-w-md">
        <CreateRoomButton />
        <JoinRoomButton />
      </main>
      <footer className="w-full max-w-2xl text-center mt-8">
        <p className="text-sm text-gray-500">QuizVerse - The ultimate quiz platform for fun and learning.</p>
      </footer>
    </div>
  );
};

export default page;
