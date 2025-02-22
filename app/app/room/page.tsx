import React from 'react';

import CreateRoomButton from "@/components/Room Components/CreateRoomButton";
import JoinRoomButton from '@/components/Room Components/JoinRoom';

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-2xl text-center mt-12 mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          Challenge Yourself with StudySync
        </h1>
        <p className="text-lg text-gray-300">
          Create or join a quiz room and challenge your friends!
        </p>
      </header>
      <main className="flex p-6 flex-col items-center h-fit justify-center space-y-4 w-full max-w-md">
        <CreateRoomButton />
        <JoinRoomButton />
      </main>
    </div>
  );
};

export default Page;