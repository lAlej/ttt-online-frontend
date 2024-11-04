"use client";
import { newUser } from "@/utils/api";
import { validateEmail } from "@/utils/emailValidator";
import { Button, Grid2, TextField, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/user/UserContext";

export default function Page() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [validateData, setValidateData] = React.useState({
    username: {
      isValid: false,
      errorMessage: "",
    },
    email: {
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

    if (name === "email") {
      if (value !== "") {
        const emailValidator = validateEmail(value);
        if (!emailValidator) {
          setValidateData({
            ...validateData,
            email: {
              isValid: true,
              errorMessage: "Use a valid email",
            },
          });
        } else {
          setValidateData({
            ...validateData,
            email: {
              isValid: false,
              errorMessage: "",
            },
          });
        }
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleRegister = async () => {
    try {
      const user = await newUser(formData);
      if (user.result.data.typeError === "email-exists") {
        return setValidateData({
          ...validateData,
          email: {
            isValid: true,
            errorMessage: "Email already exists",
          },
        });
      }

      if (user.result.data.typeError === "user-exists") {
        return setValidateData({
          ...validateData,
          username: {
            isValid: true,
            errorMessage: "Username already exists",
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
    console.log(formData);
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
      <Typography>Register</Typography>
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
        error={validateData.email.isValid}
        helperText={validateData.email.errorMessage}
        id="email"
        label="Email"
        variant="outlined"
        name="email"
        type="email"
        onChange={handleChange}
      />
      <TextField
        id="password"
        label="Password"
        name="password"
        variant="outlined"
        type="password"
        onChange={handleChange}
      />
      <Button variant="contained" onClick={handleRegister}>
        Register
      </Button>
    </Grid2>
  );
}
