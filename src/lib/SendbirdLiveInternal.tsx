import React, { useEffect, useState } from "react";
import { init } from "./dux/sdk/thunks";
import PubSub from "./pubsub";
import { SendbirdLiveContext } from "./sendbirdLiveContext";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";

interface SendbirdLiveInternalProps {
  userId: string;
  appId: string;
  accessToken?: string;
  signOut: () => void;
  customApiHost?: string;
  customWebSocketHost?: string;
  children?: React.ReactNode;
  theme?: Record<string, string>;
  colorSet?: Record<string, string>;
  stringSet?: Record<string, string | ((...args: any) => string)>;
  imageSet?: Record<string, string>;
  fontSet?: Record<string, string>;
}

export default function SendbirdLiveInternal(props: SendbirdLiveInternalProps) {
  const {
    userId,
    appId,
    accessToken,
    signOut,
    customApiHost,
    customWebSocketHost,
    children,
    theme,
    colorSet,
    stringSet,
    imageSet,
    fontSet,
  } = props;

  const [initialized, setInitialized] = useState<boolean>(false);
  const [pubSub, setPubSub] = useState<PubSub>();

  const globalStore = useSendbirdStateContext();
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;

  useEffect(() => {
    // init
    const doInit = async () => {
      if (!sdkInit) return;

      await init({
        userId,
        appId,
        accessToken,
        chatInstance: sdk,
      });

      setPubSub(new PubSub());

      setInitialized(true);
    }

    doInit();
  }, [userId, appId, accessToken, sdkInit])

  return (
    <SendbirdLiveContext.Provider value={{
      userId,
      appId,
      accessToken,
      signOut,
      customApiHost,
      customWebSocketHost,
      children,
      theme,
      colorSet,
      // @ts-ignore
      stringSet,
      imageSet,
      fontSet,
      pubSub,
    }}>
      {
        !initialized
          ? <div />
          : children
      }
    </SendbirdLiveContext.Provider>
  )
}