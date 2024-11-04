import {createContext} from "react";

interface UserContext {
  user: string | null;
  setUser: (user: string | null) => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
  isLoading: true,
});