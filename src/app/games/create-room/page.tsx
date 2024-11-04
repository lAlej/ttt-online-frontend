"use client";

import { UserContext } from "@/app/context/user/UserContext";
import { socket } from "@/utils/socketConnection";
import {
  Button,
  Grid2,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

const CustomPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  lineHeight: "60px",
  width: "100%",
  padding: "20px",
  display: "flex",
  justifyContent: "space-around",
}));

export default function Page() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const lightTheme = createTheme({ palette: { mode: "light" } });
  const [roomName, setRoomName] = React.useState(`${user}'s Room`);

  const handleCreateRoom = () => {
    socket.emit("createRoom", roomName);
    socket.on("roomCreated", (roomInfo) => {
      if (roomInfo.success) {
        router.push(`/games/${roomInfo.roomId}`);
      }
    });
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
        <Typography variant="h4">Create a Room</Typography>
      </Grid2>
      <Grid2 container width="70%" alignItems="center" justifyContent="center">
        <ThemeProvider theme={lightTheme}>
          <CustomPaper elevation={4}>
            <Grid2
              container
              direction={"column"}
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <TextField
                label="Room Name"
                variant="outlined"
                defaultValue={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Grid2 container flexDirection={"row"} gap={2}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={() => handleCreateRoom()}
                  disabled={roomName === ""}
                  variant="contained"
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                >
                  Create
                </Button>
              </Grid2>
            </Grid2>
          </CustomPaper>
        </ThemeProvider>
      </Grid2>
    </Grid2>
  );
}
