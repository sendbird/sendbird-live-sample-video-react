
import React, { ReactElement, useEffect, useState } from 'react';
import { LiveEvent } from '@sendbird/live';
import { OpenChannel, sendbirdSelectors, useSendbirdStateContext } from '@sendbird/uikit-react';

import EventDetailView from '../EventDetailView';
import UserListView from '../UserListView';

import '@sendbird/uikit-react/dist/index.css';
import './index.scss';

interface Props {
  liveEvent: LiveEvent;
  initialViewStack?: RightPanelComponentType[];
}

export enum RightPanelComponentType {
  CHAT,
  EVENT_INFO,
  HOST_LIST,
  PARTICIPANT_LIST,
}

export default function RightPanel({
  liveEvent,
  initialViewStack = [RightPanelComponentType.CHAT],
}: Props): ReactElement {
  const { openChannel } = liveEvent;
  const context = useSendbirdStateContext();
  const sb = sendbirdSelectors.getSdk(context);

  const [isOpen, setOpen] = useState(true);
  const [viewStack, setViewStack] = useState([...initialViewStack]);
  const [currentView, setCurrentView] = useState(initialViewStack[initialViewStack.length - 1]);
  const pushViewStack = (componentType: RightPanelComponentType) => {
    setViewStack([...viewStack, componentType]);
  }
  const popViewStack = () => {
    if (viewStack.length > 1) {
      setViewStack(viewStack.slice(0, -1));
    }
  }

  useEffect(() => {
    const { openChannel } = liveEvent;
    setViewStack([...initialViewStack]);
  }, [liveEvent]);

  useEffect(() => {
    setCurrentView(viewStack[viewStack.length - 1]);
  }, [viewStack]);

  return (
    isOpen ?
      <div className='sendbirdlive-right__wrapper'>
        {currentView === RightPanelComponentType.CHAT ?
          <OpenChannel
            channelUrl={liveEvent.liveEventId}
            useMessageGrouping={true}
            onChatHeaderActionClick={() => {
              if (liveEvent.isHost) {
                pushViewStack(RightPanelComponentType.EVENT_INFO);
              } else {
                pushViewStack(RightPanelComponentType.PARTICIPANT_LIST);
              }
            }}
          /> :
          null}
        {currentView === RightPanelComponentType.EVENT_INFO ?
          <EventDetailView
            liveEvent={liveEvent}
            onHostsClick={() => pushViewStack(RightPanelComponentType.HOST_LIST)}
            onParticipantsClick={() => pushViewStack(RightPanelComponentType.PARTICIPANT_LIST)}
            onClose={() => popViewStack()}
          /> :
          null}
        {currentView === RightPanelComponentType.HOST_LIST ?
          <UserListView
            title={'Hosts'}
            count={openChannel.operators.length}
            query={async () => {
              return {
                result: openChannel.operators,
                hasNext: false,
              };
            }}
            onClose={() => popViewStack()}
          /> :
          null}
        {currentView === RightPanelComponentType.PARTICIPANT_LIST ?
          <UserListView
            title={'Participants'}
            count={openChannel.participantCount}
            query={async () => {
              const participantListQuery = openChannel.createParticipantListQuery({});
              const participants = participantListQuery ? await participantListQuery.next() : [];
              const hasNext = participantListQuery?.hasNext;
              return {
                result: participants,
                hasNext,
              };
            }}
            onClose={() => popViewStack()}
          /> :
          null}
      </div>
      :
      <div>
      </div>
  );
}