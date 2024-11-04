import { Grid2, Typography, Box } from "@mui/material";

export const messageBubble = (name: string, message: string) => {
  return (
    <Grid2
      container
      sx={{
        borderRadius: 1.5,
        backgroundColor: "rgb(229, 231, 235)",
        padding: 1,
        minHeight: 40,
        maxWidth: "85%",
        width: "fit-content",
      }}
    >
      <Box sx={{ width: "100%", wordBreak: "break-word" }}>
        <Typography component="span" sx={{ fontWeight: "bold", marginRight: 1 }}>
          {name}:
        </Typography>
        <Typography component="span">{message}</Typography>
      </Box>
    </Grid2>
  );
};
