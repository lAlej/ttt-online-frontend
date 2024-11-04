"use client";
import React, { use } from "react";
import { Button, Grid2, Typography } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CloseIcon from "@mui/icons-material/Close";
import { socket } from "@/utils/socketConnection";
import { getAllUsers } from "@/utils/api";

interface TableProps {
  roomId: string | string[];
}

export default function Table({ roomId }: TableProps) {
  const [table, setTable] = React.useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [gameTurn, setGameTurn] = React.useState<"X" | "O">("X");
  const [playerSymbol, setPlayerSymbol] = React.useState<"X" | "O">("X");
  const [isPlayerTurn, setIsPlayerTurn] = React.useState<boolean>(false);

  const [spectator, setSpectator] = React.useState<boolean>(false);

  const move = (row: number, column: number, symbol: string) => {
    setTable((prevState) => {
      const newState = [...prevState];
      newState[row][column] = symbol;

      socket.emit("newMoveTable", {
        updateTable: newState,
        room: roomId,
      });

      return newState;
    });
  };

  React.useEffect(() => {
    socket.on("updatedTable", (data) => {
      setTable(data);
    });

    socket.on("roomData", (data) => {
      if (
        data.room.usersSpectators.find(
          (userId: string) => userId === data.userId
        )
      ) {
        setSpectator(true);
      }

      const newSymbol =
        data.room.usersPlayers[0] !== data.userId
          ? data.room.firstPlayerTurn === "X"
            ? "O"
            : "X"
          : data.room.firstPlayerTurn;
      setPlayerSymbol(newSymbol);
    });

    return () => {
      socket.off("updatedTable");
      socket.off("gameTurn");
      socket.off("roomData");
      socket.off("newTurn");
    };
  }, [roomId]);

  React.useEffect(() => {
    const handleNewTurn = (data: "X" | "O") => {
      setGameTurn(data);
      setIsPlayerTurn(data === playerSymbol);
    };

    socket.on("newTurn", handleNewTurn);

    return () => {
      socket.off("newTurn");
    };
  }, [playerSymbol]);

  return (
    <Grid2
      container
      flexDirection={"column"}
      justifyContent={"center"}
      height={"70vh"}
      minWidth={"60vw"}
      boxShadow="0px 0px 15px -5px rgba(0,0,0,0.61)"
      borderRadius={1.5}
    >
      <Grid2 paddingLeft={5}>
        <Grid2 container alignItems={"center"} justifyContent={"start"}>
          <Typography>Room: {roomId}</Typography>
          <Button style={{ textTransform: "none" }}>Copy gameId</Button>
        </Grid2>
        <Grid2 container alignItems={"center"} justifyContent={"start"}>
          <Typography>Turn: </Typography>
          <Typography>{` ${gameTurn}`}</Typography>
        </Grid2>
        <Grid2 container alignItems={"center"} justifyContent={"start"}>
          <Typography>Your symbol: </Typography>
          <Typography>{` ${playerSymbol}`}</Typography>
        </Grid2>
      </Grid2>
      <Grid2
        container
        alignItems={"center"}
        justifyContent={"center"}
        padding={2}
      >
        <Grid2>
          {table.map((itemRow, indexRow) => (
            <Grid2 key={indexRow}>
              {itemRow.map((itemCol, indexCol) => (
                <Button
                  key={indexCol}
                  onClick={() => move(indexRow, indexCol, playerSymbol)}
                  style={{
                    backgroundColor: "rgb(229, 231, 235)",
                    borderRadius: 5,
                    width: 150,
                    height: 150,
                    margin: 8,
                  }}
                >
                  {itemCol === "X" && (
                    <CloseIcon
                      style={{ width: 100, height: 100, color: "#000" }}
                    />
                  )}
                  {itemCol === "O" && (
                    <RadioButtonUncheckedIcon
                      style={{ width: 100, height: 100, color: "#000" }}
                    />
                  )}
                </Button>
              ))}
            </Grid2>
          ))}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
