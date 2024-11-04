"use client";
import { Grid2, TextField, Typography } from "@mui/material";
import React, { useContext } from "react";
import { socket } from "@/utils/socketConnection";
import { messageBubble } from "./MessageBubble";
import { UserContext } from "@/app/context/user/UserContext";

export interface Message {
  name: string;
  message: string;
}

interface ChatProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  roomId: string | string[];
}

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
  const ref = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);

  return ref;
}

export default function Chat({ messages, setMessages, roomId }: ChatProps) {
  const { user } = useContext(UserContext);
  const [message, setMessage] = React.useState("");
  const [displayName, setDisplayName] = React.useState(user || "");
  const ref = useChatScroll(messages);

  const sendMessage = () => {
    if (message === "") return;

    socket.emit("message", {
      name: displayName,
      message: message,
      room: roomId,
    });

    const newMessage: Message = {
      name: displayName,
      message,
    };

    setMessage("");
    setMessages([...messages, newMessage]);
  };

  React.useEffect(() => {
    socket.on("roomData", (data) => {
      if (data.usersPlayers.length === 1) {
        setDisplayName("Luisito");
      } else {
        setDisplayName("Alejandrito");
      }
    });

    return () => {
      socket.off("message");
    };
  }, [roomId]);

  return (
    <Grid2
      container
      boxShadow="0px 0px 15px -5px rgba(0,0,0,0.61)"
      padding={2}
      borderRadius={1.5}
      width={350}
      maxWidth={"20vw"}
      height={"70vh"}
    >
      <Grid2 container direction="column" justifyContent="start" gap={2} height="100%">
        <Typography>Chat</Typography>
        <Grid2 container ref={ref} sx={styles.stylesChat}>
          {messages.map((message, index) => (
            <Grid2
              key={index}
              container
              width={"100%"}
              justifyContent={
                message.name === displayName ? "flex-end" : "flex-start"
              }
              mb={1}
            >
              {messageBubble(message.name, message.message)}
            </Grid2>
          ))}
        </Grid2>
        <Grid2 container alignItems={"end"}>
          <TextField
            variant="outlined"
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            fullWidth
          />
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

const styles = {
  stylesChat: {
    flexDirection: "column",
    flexGrow: 1,
    overflowY: "auto",
    padding: 1,
    "&::-webkit-scrollbar": {
      width: "10px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "8px",
      border: "2px solid #f1f1f1",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },

    // Firefox scrollbar styling
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #f1f1f1",
  },
};
