import React, { useState } from "react";
import { HStack, Input, Button } from "@chakra-ui/react";

export default function RoomForm({ socket }) {
  const [roomName, setRoomName] = useState("");
  return (
    <HStack>
      <Input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="room name"
      />
      <Button onClick={() => socket.emit("switchRoom", roomName)}>
        Join Room
      </Button>
    </HStack>
  );
}
