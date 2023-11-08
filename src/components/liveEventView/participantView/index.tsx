import React, { useContext, useEffect, useRef, useState } from 'react';
import { LiveEvent, LiveEventState } from "@sendbird/live";

import './index.scss';
import { ReactComponent as IconUser } from "../../../assets/svg/icons-user.svg";
import { useToast } from './Toast';
import RightPanel from "../../RightPanel";
import useModal from "../../../hooks/useModal";
import EndedModalView from "./EndedModalView";
import { SendbirdLiveContext } from "../../../lib/sendbirdLiveContext";

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

interface OnEndEventClickedProps {
  onClick: () => void;
}

interface ParticipantViewProps {
  liveEvent: LiveEvent;
  onClose: (liveEvent?: LiveEvent) => void;
  showDuration?: boolean;
  onEndEventClick?: (props: OnEndEventClickedProps) => void;
  showStatusLabel?: boolean;
  showParticipantCount?: boolean;
  eventEndViewDisplayTime?: number;
}

export default function ParticipantView(props: ParticipantViewProps) {
  const {
    liveEvent,
    onClose,
    showDuration,
    onEndEventClick,
    showStatusLabel,
    showParticipantCount,
    eventEndViewDisplayTime,
  } = props;

  const video = useRef<HTMLVideoElement>(null);
  const [Toast, notify, reset] = useToast();
  const [hosts, setHosts] = useState(liveEvent.hosts);
  const [title, setTitle] = useState(liveEvent.title);
  const [coverUrl, setCoverUrl] = useState(liveEvent.coverUrl);
  const [state, setState] = useState(liveEvent.state);
  const [participantCount, setParticipantCount] = useState(liveEvent.participantCount || 0);
  const [EndedModal, openEndedModal, closeEndedModal] = useModal('', '');
  const [modalTimer, setModalTimer] = useState<ReturnType<typeof setTimeout>>();

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

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const { stringSet } = useContext(SendbirdLiveContext);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
  }, []);

  const divideViewport = (W: number, H: number, n: number) => {
    let rows = Math.floor(Math.sqrt(n));
    let columns = n / rows;

    while (rows * columns > n && rows > 1) {
      rows -= 1;
      columns = n / rows;
    }
    const width = W / columns;
    const height = H / rows;

    return [rows, columns, width, height];
  }

  const setup = async () => {
  };

  const _openEndedModal = () => {
    openEndedModal();

    const timer = setTimeout(() => {
      exit();
    }, eventEndViewDisplayTime ?? 3000);

    setModalTimer(timer);
  };

  const exit = async () => {
    clearTimeout(modalTimer);
    setModalTimer(undefined);

    closeEndedModal();
    onClose(liveEvent);
  };

  useEffect(() => {
    setup();
  }, [hosts, state]);

  useEffect(() => {
    if (liveEvent.state === LiveEventState.CREATED
    || liveEvent.state === LiveEventState.READY) {
      notify('Live event will begin soon.');
    }

    const unsubscribers = [
      liveEvent.on('liveEventStarted', () => {
        setState(liveEvent.state);
      }),
      liveEvent.on('liveEventEnded', () => {
        setState(liveEvent.state);
        _openEndedModal();
      }),
      liveEvent.on('hostEntered', () => {
        notify('Host Entered');
        setHosts(liveEvent.hosts);
      }),
      liveEvent.on('hostConnected', (liveEvent, host) => {
        notify('Host Connected');
        setHosts(liveEvent.hosts);
      }),
      liveEvent.on('hostDisconnected', () => {
        notify('Host Disconnected');
        setHosts(liveEvent.hosts);
      }),
      liveEvent.on('hostExited', () => {
        notify('Host Exited');
        setHosts(liveEvent.hosts);
      }),
      liveEvent.on('hostMutedAudio', () => {
        notify('Host is muted');
        setHosts(liveEvent.hosts);
      }),
      liveEvent.on('hostUnmutedAudio', () => {
        notify('Host is unmuted');
        setHosts(liveEvent.hosts);
      }),
      liveEvent.on('participantCountChanged', (liveEvent, participantCountInfo) => {
        setParticipantCount(participantCountInfo.participantCount);
      }),
      liveEvent.on('liveEventUpdated', () => {
        setTitle(liveEvent.title);
        setCoverUrl(liveEvent.coverUrl);
      }),
      liveEvent.on('exited', () => {
        onClose(liveEvent);
      }),
    ];

    return () => {
      unsubscribers.map(unsubscriber => unsubscriber());
    }
  }, [liveEvent]);

  function getMM(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);

    minutes = minutes % 60;

    return `${minutes < 0 ? 0 : minutes}`;
  }

  const { width, height } = windowDimensions;
  const [rows, columns, individualWidth, individualHeight] = divideViewport(width - 320, height - 145, hosts.length);
  const videoStyle = {
    width: individualWidth - 4,
    height: individualHeight - 4,
  }

  return (
    <div className="participant-view">
      <div className="participant-view__main">
        <Toast />
        <div className="video-wrapper">
            {hosts.length && Array(rows).fill(0).map((_, i) => {
              return (
                <div key={i} className="video-wrapper__rows">
                  {Array(columns).fill(0).map((_, j) => {
                    const host = hosts[(columns * i) + j];

                    return (
                      <div style={{ ...videoStyle, position: 'relative' }}>
                        <video key={host.hostId} style={videoStyle} autoPlay playsInline className="participant-view__video" ref={el => {
                          if (!el) return;
                          liveEvent.setMediaViewForLiveEvent(el, host.hostId);
                        }}/>
                        <div className="participant-info">{host.userId}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
        </div>
        <div className="participant-view__info">
          <div className="participant-view__profile">
            {
              (coverUrl) ?
                <img src={coverUrl} alt='cover image' className='participant-view__profile__cover-image' /> :
                <IconUser viewBox='-4 -4 20 20' width={56} height={56} />
            }
          </div>
          <div className="participant-view__info__wrapper">
            <div className="participant-view__title__wrapper">
              <div className={`event-state--${state}`}>{mapStateName(state)}</div>
              <div className="participant-view__title">{title ? title : stringSet.CREATE_EVENT_DEFAULT_TITLE}</div>
            </div>
            <div className="participant-view__detail">{participantCount ?? 0} watching now { state === LiveEventState.ONGOING ? `∙ Started ${getMM(liveEvent.duration)} mins ago` : '' }</div>
            <div className="participant-view__host-name">{hosts.length ? hosts.map(host => host.nickname).join(', ') || ' ' : 'No Host'}</div>
          </div>
        </div>
      </div>
      {/*<RightPanel liveEvent={liveEvent} />*/}
      <EndedModal>
        <EndedModalView onClose={exit} />
      </EndedModal>
    </div>
  )
}