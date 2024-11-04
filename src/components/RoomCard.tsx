"use client";

import { Button, Grid2, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupIcon from "@mui/icons-material/Group";

export interface Room {
  id: string;
  roomName: string;
  usersPlayers: string[];
  usersSpectators: string[];
}

interface RoomCardProps {
  room: Room;
  roomId: string;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomCard({ room, roomId, onJoinRoom }: RoomCardProps) {
  return (
    <Grid2
      container
      direction="column"
      justifyContent="center"
      spacing={2}
      style={{
        width: 400,
        height: 180,
        border: "1px solid #E4E4E7",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Typography textAlign="start" variant="h6" fontWeight="bold">
        {room.roomName}
      </Typography>
      <Grid2 container justifyContent="space-between">
        <Typography textAlign="center" style={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon style={{ fontSize: 16, marginRight: '4px' }} />
          {room.usersPlayers.length} players
        </Typography>
        <Typography textAlign="center" style={{ display: 'flex', alignItems: 'center' }}>
          <VisibilityIcon style={{ fontSize: 16, marginRight: '4px' }} />
          {room.usersSpectators.length} spectators
        </Typography>
        <Button
          variant="contained"
          onClick={() => onJoinRoom(roomId)}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            textTransform: "none",
            width: "100%",
          }}
        >
          Join Room
        </Button>
      </Grid2>
    </Grid2>
  );
}
