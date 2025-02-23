import React from 'react';
import Link from 'next/link';
import { UploadCloud, Image, File } from 'lucide-react';

interface RoomContentUploadProps {
  roomId?: string;
}

const RoomContentUpload: React.FC<RoomContentUploadProps> = ({ roomId }) => {
  if (!roomId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold mb-2">Upload Content</h1>
      <p className="text-base mb-6 text-center text-gray-400">Choose the type of content you want to upload to the room.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        <Link href={`/app/upload/${roomId}`}>
          <div className="block bg-[#1E1E1E] p-4 rounded-lg text-center hover:bg-[#2C2C2C] transition">
            <UploadCloud className="w-6 h-6 mx-auto mb-1 text-green-400" />
            <div className="text-lg font-semibold">Text Upload</div>
          </div>
        </Link>
        <Link href={`/app/upload/${roomId}`}>
          <div className="block bg-[#1E1E1E] p-4 rounded-lg text-center hover:bg-[#2C2C2C] transition">
            <Image className="w-6 h-6 mx-auto mb-1 text-green-400" />
            <div className="text-lg font-semibold">Photo Upload</div>
          </div>
        </Link>
        <Link href={`/app/upload/${roomId}`}>
          <div className="block bg-[#1E1E1E] p-4 rounded-lg text-center hover:bg-[#2C2C2C] transition">
            <File className="w-6 h-6 mx-auto mb-1 text-green-400" />
            <div className="text-lg font-semibold">PDF Upload</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RoomContentUpload;