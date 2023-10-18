import React from "react"
import { getStringSet } from "./stringSet";

interface SendbirdLiveContextValues {
  userId: string;
  nickname: string;
  signOut: () => void;
  stringSet: ReturnType<typeof getStringSet>;
}

// @ts-ignore
export const SendbirdLiveContext = React.createContext<SendbirdLiveContextValues>({});