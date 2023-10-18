import { LiveEvent } from "@sendbird/live";

export type TOPICS = {
  ENTER_LIVE_EVENT: {
    name: 'ENTER_LIVE_EVENT',
    params: [LiveEvent],
  },
  EXIT_LIVE_EVENT: {
    name: 'EXIT_LIVE_EVENT',
    params: [LiveEvent],
  }
}