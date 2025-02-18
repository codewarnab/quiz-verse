"use client";
import React from 'react';
import RoomContentUplaod from '@/components/Room Components/RoomContentUplaod';
import { useParams } from 'next/navigation';

const Page = () => {
  const { newRoomId } = useParams();
  // console.log(typeof newRoomId);

  return (
    <div>
      <RoomContentUplaod roomId={String(newRoomId)} />
    </div>
  );
};

export default Page;