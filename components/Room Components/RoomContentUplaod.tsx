import React from 'react'
import Link from 'next/link';

interface RoomContentUplaodProps {
  roomId: string;
}
const RoomContentUplaod: React.FC<RoomContentUplaodProps> = ({ roomId }) => {
  return (

    <>
    
    <h1 className="text-2xl font-bold mb-4">Upload Options</h1>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <Link href={`/app/upload/${roomId}`}>
    <div className="block bg-[#1E1E1E] p-4 rounded-lg text-center hover:bg-[#2C2C2C] transition">
      <div className="text-lg font-semibold text-green-400">Text Upload</div>
    </div>
  </Link>
  <Link href={`/app/upload/${roomId}`}>
    <div className="block bg-[#1E1E1E] p-4 rounded-lg text-center hover:bg-[#2C2C2C] transition">
      <div className="text-lg font-semibold text-green-400">Photo Upload</div>
    </div>
  </Link>
  <Link href={`/app/upload/${roomId}`}>
    <div className="block bg-[#1E1E1E] p-4 rounded-lg text-center hover:bg-[#2C2C2C] transition">
      <div className="text-lg font-semibold text-green-400">PDF Upload</div>
    </div>
  </Link>
</div>
    </>
  )
}

export default RoomContentUplaod