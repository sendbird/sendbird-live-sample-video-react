import { LiveEvent, LiveEventState } from "@sendbird/live";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as SettingsIcon } from '../../../../assets/svg/icons-settings-filled.svg';
import { ReactComponent as MicIcon } from '../../../../assets/svg/icons-mic-filled.svg';
import { ReactComponent as MicOffIcon } from '../../../../assets/svg/icons-mic-off-filled.svg';
import { ReactComponent as CameraIcon } from '../../../../assets/svg/icons-camera-filled.svg';
import { ReactComponent as CameraOffIcon } from '../../../../assets/svg/icons-camera-off-filled.svg';

import './index.scss';
import { SendbirdLiveContext } from "../../../../lib/sendbirdLiveContext";
import Duration from "./Duration";

interface ControlBarProps {
  liveEvent: LiveEvent;
  exitDisabled: boolean;
  exiting: boolean;
  onStart: (liveEvent: LiveEvent) => void;
  onEnd: (liveEvent: LiveEvent) => void;
  onExit: (liveEvent: LiveEvent) => void;
  onSettings: (liveEvent: LiveEvent) => void;
}

export default function ControlBar(props: ControlBarProps) {
  const {
    liveEvent,
    exitDisabled,
    exiting,
    onStart,
    onEnd,
    onExit,
    onSettings,
  } = props;

  const [ongoing, setOngoing] = useState(liveEvent.state === LiveEventState.ONGOING);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [starting, setStarting] = useState(false);
  const startingRef = useRef(false);

  const { stringSet } = useContext(SendbirdLiveContext);

  const startLiveEvent = async () => {
    // Ignore re-entry (e.g. double-click) so one request settling can't re-enable Exit while another is pending.
    if (startingRef.current || exiting) return;
    startingRef.current = true;
    setStarting(true);
    try {
      await liveEvent.startEvent({ turnAudioOn: audio, turnVideoOn: video });
      setOngoing(true);
      onStart(liveEvent);
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  }

  const canExit = !exitDisabled && !starting && !exiting;

  const toggleVideo = (on: boolean) => {
    on ? liveEvent.startVideo() : liveEvent.stopVideo();
    setVideo(on);
  }

  const toggleAudio = (on: boolean) => {
    on ? liveEvent.unmuteAudioInput() : liveEvent.muteAudioInput();
    setAudio(on);
  }
  useEffect(() => {
    const unsubscribers = [
      liveEvent.on('liveEventStarted', () => {
        liveEvent.startStreaming({turnVideoOn: true, turnAudioOn: true});
        setOngoing(true);
      }),
    ];

    return () => {
      unsubscribers.map(unsubscriber => unsubscriber());
    }
  }, [liveEvent]);

  return (
    <div className="control-bar">
      <div className="control-bar__left-buttons">
        <div className="control-bar__settings">
          <SettingsIcon viewBox="0 0 64 64" width={22} height={22} fill="#ccc" onClick={() => onSettings(liveEvent)}/>
        </div>
        <div className="control-bar__video">
          {
            video
              ? <CameraIcon viewBox="0 0 64 64" width={22} height={22} fill="#ccc" onClick={() => toggleVideo(false) }/>
              : <CameraOffIcon viewBox="0 0 64 64" width={22} height={22} fill="#ccc" onClick={() => toggleVideo(true) }/>
          }
        </div>
        <div className="control-bar__audio__wrapper">
          <div className="control-bar__audio">
            {
              audio
                ? <MicIcon viewBox="0 0 64 64" width={22} height={22} fill="#ccc" onClick={() => toggleAudio(false) }/>
                : <MicOffIcon viewBox="0 0 64 64" width={22} height={22} fill="#ccc" onClick={() => toggleAudio(true) }/>
            }
          </div>
          <div className="control-bar__volume" />
        </div>
      </div>
      <div className="control-bar__right-buttons">
        {
          ongoing && <div className="participant-icon--red" />
        }
        {
          ongoing && <Duration liveEvent={liveEvent} />
        }
        {
          !ongoing && (
            <div
              className={`control-bar__exit-live${canExit ? '' : ' control-bar__exit-live--disabled'}`}
              onClick={() => { if (canExit) onExit(liveEvent) }}
            >
              {stringSet.LIVE_EVENT_EXIT_BUTTON}
            </div>
          )
        }
        {
          ongoing
            ? <div className="control-bar__end-live" onClick={() => { onEnd(liveEvent) }}>{stringSet.LIVE_EVENT_END_DIALOG_OPTION_END}</div>
            : <div className={`control-bar__start-live${exiting ? ' control-bar__start-live--disabled' : ''}`} onClick={startLiveEvent}>{stringSet.START_LIVE_EVENT_HEADER_BUTTON}</div>
        }
      </div>
    </div>
  );
}