
import React, { ReactElement, useContext } from 'react';

import { ReactComponent as CloseIcon } from '../../assets/svg/icons-close.svg';

import './index.scss';
import { SendbirdLiveContext } from "../../lib/sendbirdLiveContext";

interface Props {
  onExit?: (isEnding: boolean) => void;
  onClose?: () => void;
}

export default function ConfirmEndDialog({
  onExit = () => {},
  onClose = () => {},
}: Props): ReactElement {

  const { stringSet } = useContext(SendbirdLiveContext);

  return <div className='confirm-end-dialog'>
    <div className='header'>
      <div className='title'>{stringSet.LIVE_EVENT_END_DIALOG_DESCRIPTION}</div>
      <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60' fill='#fff' /></div>
    </div>
    <div className='buttons'>
      <div className='minor-button' onClick={() => onClose()}>Cancel</div>
      <div className='minor-button' onClick={() => onExit(false)}>{stringSet.LIVE_EVENT_END_DIALOG_OPTION_EXIT}</div>
      <div className='major-button' onClick={() => onExit(true)}>{stringSet.LIVE_EVENT_END_DIALOG_OPTION_END}</div>
    </div>
  </div>;
}