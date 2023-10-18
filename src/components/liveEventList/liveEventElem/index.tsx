import React, { useContext } from "react";
import { LiveEvent, LiveEventState } from "@sendbird/live";
import { ReactComponent as DefaultThumbnail1 } from '../../../assets/svg/img-thumbnail-default-1.svg'

import '../index.scss';
import { SendbirdLiveContext } from "../../../lib/sendbirdLiveContext";

interface LiveEventElemProps {
  liveEvent: LiveEvent;
  onClick: (liveEvent: LiveEvent) => void;
  showHostNickname?: boolean;
  showStatusLabel?: boolean;
}


export default function LiveEventElem(props: LiveEventElemProps) {
  const {
    liveEvent,
    onClick,
    showHostNickname = true,
    showStatusLabel = true,
  } = props;

  const { stringSet } = useContext(SendbirdLiveContext);

  const mapStateName = (name: string) => {
    switch (name) {
      case 'created':
        return stringSet.EVENT_STATUS_CREATED;
      case 'ready':
        return stringSet.EVENT_STATUS_READY;
      case 'ongoing':
        return stringSet.EVENT_STATUS_ONGOING;
      case 'ended':
        return stringSet.EVENT_STATUS_ENDED;
    }
  }

  return (
    <div className="live-event-elem" onClick={() => onClick(liveEvent)}>
      <div className="cover-image__wrapper">
        {
          liveEvent.coverUrl
            ? <img src={liveEvent.coverUrl} alt="cover_image" className="cover-image" />
            : <DefaultThumbnail1 viewBox="0 0 112 64" width={112} height={64} />
        }
      </div>
      <div className="detail">
        <div className="title__wrapper">
          <div className="title">{liveEvent.title ? liveEvent.title : stringSet.CREATE_EVENT_DEFAULT_TITLE}</div>
          <div className="participant-count__wrapper">
            {
              (liveEvent.state === LiveEventState.ONGOING)
                ? <div className="participant-icon--red" />
                : <div className="participant-icon--grey" />
            }
            <div className="participant-count">{liveEvent.participantCount ?? 0}</div>
          </div>
        </div>
        {
          showHostNickname && <div className="created-by">{liveEvent.createdBy ? (liveEvent.createdBy ?? 'HOST') : stringSet.LIST_HOST_NICKNAME_PLACEHOLDER}</div>
        }
        {
          showStatusLabel && <div className={`event-state--${liveEvent.state}`}>{mapStateName(liveEvent.state)}</div>
        }
      </div>
    </div>
  )
}