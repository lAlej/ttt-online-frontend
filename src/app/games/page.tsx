"use client";
import {
  Grid2,
  Typography,
  Button,
  Paper,
  styled,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user/UserContext";
import { socket } from "@/utils/socketConnection";
import RoomCard, { Room } from "@/components/RoomCard";
import { useRouter } from "next/navigation";

interface Rooms {
  [key: string]: Room;
}

const CustomPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  lineHeight: "60px",
  width: "100%",
  padding: "20px",
  display: "flex",
  justifyContent: "space-around",
}));

export default function GamesPage() {
  const lightTheme = createTheme({ palette: { mode: "light" } });
  const router = useRouter();

  const { user, isLoading } = useContext(UserContext);
  const [rooms, setRooms] = useState<Rooms>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    const onAllRooms = (data: Rooms) => {
      console.log("Received rooms data:", data);
      setRooms(data);
    };

    socket.on("allRooms", onAllRooms);

    if (socket.connected) {
      socket.emit("getAllRooms");
    }

    return () => {
      socket.off("disconnect", onDisconnect);
      socket.off("allRooms", onAllRooms);
    };
  }, []);

  const handleRefreshRooms = () => {
    socket.emit("getAllRooms");
  };

  const handleJoinRoom = (roomId: string) => {
    socket.emit("joinRoom", roomId);
    router.push(`/games/${roomId}`);
  };

  return (
    <Grid2
      container
      direction="column"
      spacing={2}
      width="100%"
      minHeight="80vh"
      alignItems="center"
    >
      <Grid2 container justifyContent="center" alignItems="center">
        <Typography variant="h4">Games Rooms</Typography>
      </Grid2>
      <Grid2 container spacing={2}>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#000",
            color: "#fff",
          }}
          onClick={handleRefreshRooms}
        >
          Refresh Rooms
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#000",
            color: "#fff",
          }}
          onClick={() => router.push("/games/create-room")}
        >
          Create Room
        </Button>
      </Grid2>
      <Grid2 container width="70%" alignItems="center" justifyContent="center">
        <ThemeProvider theme={lightTheme}>
          <CustomPaper elevation={4}>
            {Object.keys(rooms).length === 0 ? (
              <Grid2>
                <Typography>No rooms available</Typography>
              </Grid2>
            ) : (
              Object.entries(rooms).map(([roomId, room]) => (
                <RoomCard
                  key={roomId}
                  room={room}
                  roomId={roomId}
                  onJoinRoom={handleJoinRoom}
                />
              ))
            )}
          </CustomPaper>
        </ThemeProvider>
      </Grid2>
    </Grid2>
  );
}
