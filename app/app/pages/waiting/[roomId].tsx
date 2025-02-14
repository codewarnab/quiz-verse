import { useQuery } from "convex/react";
 import {api} from "../../../../convex/_generated/api"
 

export default function WaitingArea({ params }: { params: { roomId: string } }) {
  // Fetch real-time room data
  const room = useQuery(api.rooms.getRoom, { roomId: params.roomId });

  if (!room) return <div>Loading...</div>;

  return (
    <div>
      <h1>{room.name}</h1>
      <p>Room ID: {room.roomId}</p>
      <p>Participants: {room.participants.length}</p>
      {/* Add a "Start Quiz" button if user is the owner
      {room.status === "waiting" && (
        <button onClick={() => startQuiz(room._id)}>Start Quiz</button>
      )} */}
    </div>
  );
}