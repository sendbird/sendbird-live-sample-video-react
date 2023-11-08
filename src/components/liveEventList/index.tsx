import React, { useContext, useEffect, useRef, useState } from "react";
import LiveEventElem from "./liveEventElem";
import { LiveEvent, LiveEventListQuery, LiveEventListQueryParams, SendbirdLive } from "@sendbird/live";

import './index.scss';
import { ReactComponent as IconRefresh } from '../../assets/svg/icons-refresh.svg';
import { SendbirdLiveContext } from "../../lib/sendbirdLiveContext";
import UserProfile from "./UserProfile";

interface RenderLiveEventElemProps {
  liveEvent: LiveEvent;
  onClick: LiveEventListProps['onClickElem'];
}

export interface LiveEventListProps {
  onClickCreate: () => void;
  onClickElem: (liveEvent: LiveEvent) => void;
  queryParams?: LiveEventListQueryParams;
  renderTitle?: () => React.ReactElement;
  renderCreateButton?: () => React.ReactElement;
  renderLiveEventElem?: (props: RenderLiveEventElemProps) => React.ReactElement;
  showStatusLabel?: boolean;
  showHostNickname?: boolean;
}

export default function LiveEventList(props: LiveEventListProps) {
  const {
    onClickCreate,
    onClickElem,
    queryParams,
    renderTitle,
    renderCreateButton,
    renderLiveEventElem,
    showStatusLabel = true,
    showHostNickname = true,
  } = props;

  const { stringSet, userId, nickname } = useContext(SendbirdLiveContext);

  const params = queryParams || { limit: 20 };
  const [query, setQuery] = useState<LiveEventListQuery>(SendbirdLive.createLiveEventListQuery(params));

  const liveEventList = useRef<HTMLDivElement>(null);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

  const refresh = async () => {
    setQuery(SendbirdLive.createLiveEventListQuery(params));

    if (liveEventList.current) {
      liveEventList.current.scrollTop = 0;
    }

    await getLiveEvents(true);
  };

  const getLiveEvents = async (refresh: boolean) => {
    if (!query.hasNext) return;

    try {
      const result = await query.next();

      if (refresh) {
        setLiveEvents(result);
      } else {
        setQuery(query);
        setLiveEvents([ ...liveEvents, ...result ]);
      }
    } catch (e) {
    }
  };

  const onScroll = () => {
    if (liveEventList.current) {
      const { scrollTop, scrollHeight, clientHeight } = liveEventList.current;
      if (scrollTop + clientHeight === scrollHeight) {
        getLiveEvents(false);
      }
    }
  };

  useEffect(() => {
    refresh();
  }, [queryParams])

  return (
    <div className="live-event-list-view">
      <div className="header">
        {
          renderTitle?.() ||
          <div className="title">{stringSet.LIST_HEADER_TITLE}</div>
        }
        <div className="refresh" onClick={refresh}>
          <IconRefresh viewBox="0 0 64 64" width={22} height={22}/>
        </div>
        {
          renderCreateButton?.() ||
          <div className="create-button" onClick={onClickCreate}>{stringSet.LIST_HEADER_BUTTON}</div>
        }
      </div>
      <div className="list" ref={liveEventList} onScroll={onScroll}>
        {
          liveEvents.map(liveEvent =>
            renderLiveEventElem?.({ liveEvent: liveEvent, onClick: onClickElem }) ||
            <LiveEventElem
              key={liveEvent.liveEventId}
              liveEvent={liveEvent}
              showStatusLabel={showStatusLabel}
              showHostNickname={showHostNickname}
              onClick={onClickElem}
            />
          )
        }
      </div>
      <UserProfile userId={userId} nickname={nickname} />
    </div>
  )
}