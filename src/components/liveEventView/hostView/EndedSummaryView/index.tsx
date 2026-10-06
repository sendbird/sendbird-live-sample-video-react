import React, { ReactElement, useContext } from 'react';
import { LiveEvent } from "@sendbird/live";

import { ReactComponent as CloseIcon } from '../../../../assets/svg/icons-close.svg';

import './index.scss';
import { SendbirdLiveContext } from "../../../../lib/sendbirdLiveContext";

interface EndedSummaryViewProps {
  liveEvent: LiveEvent;
  onClose?: () => void;
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function getHHMMSS(milliseconds: number) {
  // `duration` is computed from `startedAt` when the server hasn't set it, which is NaN for an event that never started.
  let seconds = Number.isFinite(milliseconds) ? Math.floor(Math.max(milliseconds, 0) / 1000) : 0;
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

export default function EndedSummaryView(props: EndedSummaryViewProps): ReactElement {
  const {
    liveEvent,
    onClose = () => {},
  } = props;

  const { stringSet } = useContext(SendbirdLiveContext);

  return <div className='ended-summary-view'>
    <div className='header'>
      <div className='title'>{stringSet.LIVE_EVENT_SUMMARY_DIALOG_TITLE}</div>
      <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60' fill='#fff' /></div>
    </div>
    <div className='summary'>
      <div className='summary__item'>
        <div className='label'>{stringSet.TOTAL_PARTICIPANTS_COUNT}</div>
        <div className='value'>{liveEvent.cumulativeParticipantCount ?? 0}</div>
      </div>
      <div className='summary__item'>
        <div className='label'>{stringSet.PEAK_CONCURRENT_PARTICIPANTS_COUNT}</div>
        <div className='value'>{liveEvent.peakParticipantCount ?? 0}</div>
      </div>
      <div className='summary__item'>
        <div className='label'>{stringSet.DURATION}</div>
        <div className='value'>{getHHMMSS(liveEvent.duration ?? 0)}</div>
      </div>
    </div>
    <div className='buttons'>
      <div className='major-button' onClick={() => onClose()}>Close</div>
    </div>
  </div>;
}
