import React from 'react';

import CreateRoomButton from "@/components/Room Components/CreateRoomButton";
import JoinRoomButton from '@/components/Room Components/JoinRoom';

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-green-500">
          Welcome to StudySync
        </h1>
        <p className="text-lg text-gray-300">
          Create or join a quiz room and challenge your friends!
        </p>
      </header>
      <main className="flex flex-col items-center h-fit justify-center space-y-8 w-full max-w-md">
        <CreateRoomButton />
        <JoinRoomButton />
      </main>
      <footer className="w-full max-w-2xl text-center mt-8">
      <p className="text-sm text-gray-500 mb-2">
        StudySync - The ultimate quiz platform for fun and learning.
      </p>
      </footer>
    </div>
  );
};

export default Page;