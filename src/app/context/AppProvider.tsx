import React from "react";
import { UserProvider } from "./user/UserProvider";
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};
