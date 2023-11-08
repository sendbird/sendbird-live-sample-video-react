import React, { useContext, useEffect, useRef, useState } from 'react';
import { LiveEvent, LiveEventState } from "@sendbird/live";

import './index.scss';
import { ReactComponent as IconUser } from "../../../assets/svg/icons-user.svg";
import ControlBar from './controlBar';
import useModal from "../../../hooks/useModal";
import ConfirmEndDialog from "../../ConfirmEndDialog";
import RightPanel from '../../RightPanel';
import { SendbirdLiveContext } from "../../../lib/sendbirdLiveContext";
import Settings from "./Settings";

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

interface HostViewProps {
  liveEvent: LiveEvent;
  userId: string;
  onClose: (liveEvent?: LiveEvent) => void;
}

export default function HostView(props: HostViewProps) {
  const {
    liveEvent,
    userId,
    onClose,
  } = props;


  const video = useRef<HTMLVideoElement>(null);
  const [hosts, setHosts] = useState(liveEvent.hosts);
  const [title, setTitle] = useState(liveEvent.title);
  const [coverUrl, setCoverUrl] = useState(liveEvent.coverUrl);
  const [state, setState] = useState(liveEvent.state);
  const [participantCount, setParticipantCount] = useState(liveEvent.participantCount || 0);
  const [EndModal, openEndModal, closeEndModal] = useModal('', 'dark-background');
  const [SettingsModal, openSettingsModal, closeSettingsModal] = useModal('');

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const { stringSet } = useContext(SendbirdLiveContext);

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

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (liveEvent.state === LiveEventState.CREATED) {
        try {
          await liveEvent.setEventReady();
        } catch (e) {}
      }

      if (
        liveEvent.state === LiveEventState.ONGOING
        || liveEvent.state === LiveEventState.READY
      ) {
        await liveEvent.startStreaming({ turnVideoOn: true, turnAudioOn: true });
      }

      setHosts([...liveEvent.hosts]);
    }

    setup();
  }, [liveEvent]);

  useEffect(() => {
    const unsubscribers = [
      liveEvent.on('liveEventStarted', () => {
        liveEvent.startStreaming({ turnVideoOn: true, turnAudioOn: true });
        setState(liveEvent.state);
      }),
      liveEvent.on('liveEventEnded', () => {
        setState(liveEvent.state);
        onClose(liveEvent);
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
      liveEvent.on('hostEntered', () => {
        console.log('host entered');
        setHosts([...liveEvent.hosts]);
      }),
      liveEvent.on('hostConnected', (liveEvent, host) => {
        console.log('host connected');
        setHosts([...liveEvent.hosts]);
      }),
      liveEvent.on('hostDisconnected', () => {
        console.log('host disconnected');
        setHosts([...liveEvent.hosts]);
      }),
      liveEvent.on('hostExited', () => {
        console.log('host exited');
        setHosts([...liveEvent.hosts]);
      }),
      liveEvent.on('hostMutedAudio', () => {
        console.log('host muted audio');
        setHosts([...liveEvent.hosts]);
      }),
      liveEvent.on('hostUnmutedAudio', () => {
        console.log('host unmuted audio');
        setHosts([...liveEvent.hosts]);
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
  const [rows, columns, individualWidth, individualHeight] = divideViewport(width, height - 145, hosts.length);
  const videoStyle = {
    width: individualWidth - 4,
    height: individualHeight - 4,
  };

  return (
    <div className="host-view">
      <div className="host-view__main">
        <div className="video-wrapper">
          {hosts.length && Array(rows).fill(0).map((_, i) => {
            return (
              <div key={i} className="video-wrapper__rows">
                {Array(columns).fill(0).map((_, j) => {
                  const host = hosts[(columns * i) + j];

                  return (
                    <div style={{ ...videoStyle, position: 'relative' }}>
                      <video key={`${i}${j}`} style={videoStyle} autoPlay playsInline className="host-view__video" ref={el => {
                        if (!el || !host) return;
                        liveEvent.setMediaViewForLiveEvent(el, host.hostId);
                        if (host.userId === userId) el.muted = true;
                      }}/>
                      <div className="participant-info" ref={el => {
                        if (!el || !host) return;
                        el.textContent = host.userId;
                      }}></div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className="host-view__info">
          <div className="host-view__profile">
            {
              (liveEvent.coverUrl) ?
                <img src={coverUrl} alt='cover image' className='host-view__profile__cover-image' /> :
                <IconUser viewBox='-4 -4 20 20' width={56} height={56} />
            }
          </div>
          <div className="host-view__info__wrapper">
            <div className="host-view__title__wrapper">
              <div className={`event-state--${state}`}>{mapStateName(state)}</div>
              <div className="host-view__title">{title ? title : stringSet.CREATE_EVENT_DEFAULT_TITLE}</div>
            </div>
            <div className="host-view__detail">{participantCount ?? 0} watching now { state === LiveEventState.ONGOING ? `∙ Started ${getMM(liveEvent.duration)} mins ago` : '' }</div>
            <div className="host-view__host-name">{hosts.length ? hosts.map(host => host.nickname).join(', ') || ' ' : 'No Host'}</div>
          </div>
        </div>
        <ControlBar
          liveEvent={liveEvent}
          onStart={(liveEvent) => {
            setHosts([...liveEvent.hosts]);
            setState(liveEvent.state);
          }}
          onEnd={() => {
            openEndModal();
          }}
          onSettings={() => {
            openSettingsModal();
          }}
        />
        <EndModal>
          <ConfirmEndDialog
            onExit={async (isEnding) => {
              if (isEnding) {
                await liveEvent.endEvent();
              } else {
                await liveEvent.exitAsHost();
              }

              closeEndModal();
              onClose(liveEvent);
            }}
            onClose={() => {
              closeEndModal();
            }}
          />
        </EndModal>
        <SettingsModal>
          <Settings liveEvent={liveEvent} onClose={() => {
            closeSettingsModal();
          }}/>
        </SettingsModal>
      </div>
      {/*<RightPanel liveEvent={liveEvent} />*/}
    </div>
  )
}