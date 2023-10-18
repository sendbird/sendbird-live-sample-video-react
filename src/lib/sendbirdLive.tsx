import React, { useMemo } from "react";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import "@sendbird/uikit-react/dist/index.css";
import SendbirdLiveInternal from "./SendbirdLiveInternal";
import { getStringSet } from "./stringSet";

interface sendbirdLiveProps {
  userId: string;
  appId: string;
  nickname?: string;
  accessToken?: string;
  signOut: () => void;
  customApiHost?: string;
  customWebSocketHost?: string;
  children?: React.ReactNode;
  theme?: Record<string, string>;
  colorSet?: Record<string, string>;
  stringSet?: Record<string, string | ((...args: any) => string)>;
}

export default function SendbirdLive(props: sendbirdLiveProps) {
  const {
    userId,
    appId,
    nickname,
    accessToken,
    signOut,
    customApiHost,
    customWebSocketHost,
    children,
    theme,
    colorSet,
    stringSet,
  } = props;

  const _stringSet = useMemo(() => {
    if (!stringSet) return getStringSet();

    return {
      ...getStringSet(),
      ...stringSet,
    };
  }, [stringSet]);

  return (
    <SendbirdProvider
      userId={userId}
      appId={appId}
      nickname={nickname}
      accessToken={accessToken}
      colorSet={colorSet}
      // stringSet={_stringSet}
    >
      <SendbirdLiveInternal { ...props } stringSet={_stringSet} />
    </SendbirdProvider>
  )
}
