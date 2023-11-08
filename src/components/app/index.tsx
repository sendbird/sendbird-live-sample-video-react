import { LiveEvent, LiveEventState, SendbirdLive } from "@sendbird/live";
import React, { useState } from "react";
import useModal from "../..//hooks/useModal";
import SendbirdLiveProvider from "../../lib/sendbirdLive";
import LiveEventList, { LiveEventListProps } from "../liveEventList";
import CreateEventView, { CreateEventViewProps } from "../CreateEventView";
import HostView from "../liveEventView/hostView";

import './index.scss';
import ParticipantView from "../liveEventView/participantView";
import EnterView from "../liveEventList/EnterView";
import EnterErrorView from "./EnterErrorView";
import emptyState from '../../assets/png/img-live-emptystate.png';

interface AppProps {
  userId: string;
  appId: string;
  nickname?: string;
  accessToken?: string;
  signOut: () => void;
  customApiHost?: string;
  customWebSocketHost?: string;
  theme?: Record<string, string>;
  colorSet?: Record<string, string>;
  stringSet?: Record<string, string>;
  customize?: {
    liveEventList?: Partial<LiveEventListProps>,
    createEventView?: Partial<CreateEventViewProps>;
  };
}

export default function App(props: AppProps) {
  const {
    userId,
    appId,
    nickname,
    accessToken,
    signOut,
    customApiHost,
    customWebSocketHost,
    theme,
    colorSet,
    stringSet,
    customize,
  } = props;

  const [isHost, setIsHost] = useState<boolean>(false);
  const [liveEventId, setLiveEventId] = useState<string>('')
  const [liveEvent, setLiveEvent] = useState<LiveEvent>();
  const [CreateEventModal, openCreateEventModal, closeCreateEventModal] = useModal('');
  const [EnterModal, openEnterModal, closeEnterModal] = useModal('');
  const [EnterErrorModal, openEnterErrorModal, closeEnterErrorModal] = useModal('');

  const liveEventListProps = {
    ...customize?.liveEventList,
    onClickCreate: () => {
      openCreateEventModal();
    },
    onClickElem: async (liveEvent: LiveEvent) => {
      try {
        const event = await SendbirdLive.getLiveEvent(liveEvent.liveEventId);

        if (
          (event.state === LiveEventState.CREATED && !(event.isHost))
          ||event.state === LiveEventState.ENDED
        ) {
          openEnterErrorModal();
          return;
        }

        if (event.isHost) {
          if (event.state === LiveEventState.CREATED) {
            await event.enterAsHost({turnAudioOn: true, turnVideoOn: true});

            setIsHost(true);
            setLiveEvent(event);
          } else {
            setLiveEventId(liveEvent.liveEventId);
            openEnterModal();
          }
        } else {
          await event.enter();

          setLiveEvent(event);
        }
      } catch (e) {
        openEnterErrorModal();
      }
    }
  }

  const LiveEventView = ({ onClose }: { onClose: (liveEvent?: LiveEvent) => void }) => {
    if (!liveEvent) return (
      <div className="sendbirdlive-app__no-event">
        <img src={emptyState} className="sendbirdlive-app__no-event-img"/>
        <div className="sendbirdlive-app__no-event__title">No live events selected</div>
        <div className="sendbirdlive-app__no-event__description">Select a live event from the list or create a live event.</div>
        <div className="sendbirdlive-app__no-event__button" onClick={openCreateEventModal}>Create</div>
      </div>
    );

    return (
      (isHost)
        ? <HostView liveEvent={liveEvent} userId={userId} onClose={onClose} />
        : <ParticipantView liveEvent={liveEvent} onClose={onClose}/>
    );
  };

  return (
    <SendbirdLiveProvider
      userId={userId}
      appId={appId}
      nickname={nickname}
      accessToken={accessToken}
      signOut={signOut}
      customApiHost={customApiHost}
      customWebSocketHost={customWebSocketHost}
      theme={theme}
      colorSet={colorSet}
      stringSet={stringSet}
    >
      <div className="sendbirdlive-app__wrapper">
        <div className="sendbirdlive-app__liveeventlist__wrapper">
          {
            !isHost && <LiveEventList { ...liveEventListProps } />
          }
        </div>
        <EnterErrorModal>
          <EnterErrorView liveEvent={liveEvent} onClose={closeEnterErrorModal} />
        </EnterErrorModal>
        <EnterModal>
          <EnterView liveEventId={liveEventId} onClose={(liveEvent?: LiveEvent, isHost?: boolean) => {
            setLiveEvent(liveEvent);

            if (liveEvent && isHost) {
              setIsHost(true);
            }
            closeEnterModal();
          }} />
        </EnterModal>
        <CreateEventModal>
          <CreateEventView onClose={(liveEvent?: LiveEvent) => {
            setLiveEvent(liveEvent);

            if (liveEvent?.isHost) {
              setIsHost(true);
            }
            closeCreateEventModal();
          }}/>
        </CreateEventModal>
        <LiveEventView onClose={() => {
          setIsHost(false);
          setLiveEvent(undefined);
        }}/>
      </div>
    </SendbirdLiveProvider>
  )
}
