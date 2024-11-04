"use client";
import { loginUser } from "@/utils/api";
import { Button, Grid2, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { UserContext } from "../context/user/UserContext";

export default function page() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });
  const [validateData, setValidateData] = React.useState({
    username: {
      isValid: false,
      errorMessage: "",
    },
    password: {
      isValid: false,
      errorMessage: "",
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setValidateData({
      ...validateData,
      [name]: {
        isValid: false,
        errorMessage: "",
      },
    });

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const user = await loginUser(formData);
      if (user.result.data.typeError === "username-not-found") {
        return setValidateData({
          ...validateData,
          username: {
            isValid: true,
            errorMessage: "Username not found",
          },
        });
      }

      if (user.result.data.typeError === "invalid-password") {
        console.log("invalid password");
        return setValidateData({
          ...validateData,
          password: {
            isValid: true,
            errorMessage: "username and password do not match",
          },
        });
      }

      if (user.result.data.sucess) {
        setUser(user.result.data.user);
        router.push("/games");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid2
      container
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <Typography>Login</Typography>
      <TextField
        error={validateData.username.isValid}
        id="username"
        label="Username"
        name="username"
        variant="outlined"
        type="username"
        onChange={handleChange}
        helperText={validateData.username.errorMessage}
      />
      <TextField
        error={validateData.password.isValid}
        helperText={validateData.password.errorMessage}
        id="password"
        label="Password"
        name="password"
        variant="outlined"
        type="password"
        onChange={handleChange}
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Grid2>
  );
}
