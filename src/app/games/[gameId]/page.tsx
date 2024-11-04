"use client";
import Chat, { Message } from "@/components/Chat";
import Table from "@/components/Table";
import { Grid2, Typography } from "@mui/material";
import { useParams, useRouter, usePathname } from "next/navigation";
import React from "react";
import { socket } from "@/utils/socketConnection";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const room = useParams().gameId;

  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    socket.connect();
    // socket.on("connect", () => {
    //   console.log("connected to socket server");
    //   socket.emit("joinRoom", room);
    // });

    socket.emit("joinRoom", room);

    socket.on("userJoined", (player) => {
      console.log("userJoined", player);
    });

    socket.on("newMessage", (message: Message) => {
      console.log("Mensaje nuevo");
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from socket server");
    });

    const handleBeforeUnload = () => {
      socket.emit("leaveRoom", room);
      socket.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [room]);

  React.useEffect(() => {
    if (pathname !== `/games/${room}`) {
      socket.emit("leaveRoom", room);
      socket.disconnect();
    }
  }, [pathname]);

  return (
    <Grid2
      container
      flexDirection={"column"}
      gap={2}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Typography fontSize={50}>Tik Tak Toe</Typography>
      <Grid2 container flexDirection={"row"} gap={2}>
        <Table roomId={room} />
        <Chat messages={messages} setMessages={setMessages} roomId={room} />
      </Grid2>
    </Grid2>
  );
}
