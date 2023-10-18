import { LiveEvent, LiveEventState } from "@sendbird/live";
import { ReactComponent as CloseIcon } from "../../../assets/svg/icons-close.svg";
import React, { useContext, useMemo } from "react";
import { SendbirdLiveContext } from "../../../lib/sendbirdLiveContext";

import './index.scss';

interface EnterErrorViewProps {
  liveEvent?: LiveEvent;
  onClose: () => void;
}

export default function EnterErrorView(props: EnterErrorViewProps) {
  const {
    liveEvent,
    onClose,
  } = props;

  const { stringSet } = useContext(SendbirdLiveContext);

  const message = useMemo(() => {
    if (liveEvent && liveEvent.state === LiveEventState.CREATED) {
      return stringSet.LIVE_EVENT_ENTER_ALERT_DESCRIPTION;
    } else {
      console.log(liveEvent);
      return stringSet.UNKNOWN_ERROR_ALERT_DESCRIPTION;
    }
  }, [liveEvent]);

  return (
    <div className='enter-error-view'>
      <div className='header'>
        <div className='title'>{message}</div>
        <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60'/></div>
      </div>
      <div className='buttons'>
        <div className='major-button' onClick={() => onClose()}>OK</div>
      </div>
    </div>
  );

}