import { ReactComponent as CloseIcon } from "../../../assets/svg/icons-close.svg";
import { ReactComponent as OperatorIcon } from '../../../assets/svg/icons-operator.svg';
import { ReactComponent as MembersIcon } from '../../../assets/svg/icons-members.svg';
import React, { useContext } from "react";
import { LiveEvent, SendbirdLive } from "@sendbird/live";

import './index.scss';
import { SendbirdLiveContext } from "../../../lib/sendbirdLiveContext";

export interface EnterViewProps {
  liveEventId: string;
  onClose: (liveEvent?: LiveEvent, isHost?: boolean) => void;
}

export default function EnterView(props: EnterViewProps) {
  const {
    liveEventId,
    onClose,
  } = props;

  const { stringSet } = useContext(SendbirdLiveContext);

  const enterAsHost = async () => {
    const liveEvent = await SendbirdLive.getLiveEvent(liveEventId);

    await liveEvent.enterAsHost({turnAudioOn: true, turnVideoOn: true});

    onClose(liveEvent, true);
  };

  const enter = async () => {
    const liveEvent = await SendbirdLive.getLiveEvent(liveEventId);
    await liveEvent.enter();

    onClose(liveEvent, false);
  };

  return (
    <div className='enter-view'>
      <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60' /></div>
      <div className='title'>{stringSet.LIVE_EVENT_ENTER_ROLE_DIALOG_TITLE}</div>
      <div className='enter-view__item' onClick={enterAsHost}>
        <div className='enter-view__item__icon'>
          <OperatorIcon viewBox="0 0 64 64" width={28} height={28} />
        </div>
        <div className='enter-view__item__text'>{stringSet.LIVE_EVENT_ENTER_ROLE_DIALOG_OPTION_HOST}</div>
      </div>
      <div className='enter-view__item' onClick={enter}>
        <div className='enter-view__item__icon'>
          <MembersIcon viewBox="0 0 64 64" width={28} height={28} />
        </div>
        <div className='enter-view__item__text'>{stringSet.LIVE_EVENT_ENTER_ROLE_DIALOG_OPTION_PARTICIPANT}</div>
      </div>
    </div>
    );
}