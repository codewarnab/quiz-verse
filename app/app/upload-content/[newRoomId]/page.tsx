"use client";
import React from 'react';
import RoomContentUplaod from '@/components/RoomContentUplaod';
import { useParams } from 'next/navigation';

const page = () => {
  const { newRoomId } = useParams();
  // console.log(typeof newRoomId);

  return (
    <div>
      dchgucduaicdhuai
      <RoomContentUplaod roomId={String(newRoomId)} />
    </div>
  );
};

export default page;