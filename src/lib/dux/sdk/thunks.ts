import { SendbirdLive } from "@sendbird/live";

interface initParams {
  userId: string,
  appId: string,
  accessToken?: string,
  chatInstance?: any;
}

export const init = async ({
  userId,
  appId,
  accessToken,
  chatInstance,
}: initParams) => {
  try {
    SendbirdLive.init({
      appId,
      chatInstance,
    });
    await SendbirdLive.authenticate(userId, accessToken);
  } catch (e) {
    console.error(e);
  }
}