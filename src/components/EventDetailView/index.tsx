
import { LiveEvent } from '@sendbird/live';
import React, { ReactElement, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { ReactComponent as CloseIcon } from '../../assets/svg/icons-close.svg';
import { ReactComponent as RightArrowIcon } from '../../assets/svg/icons-chevron-right.svg';
import { ReactComponent as ToggleOnIcon } from '../../assets/svg/icons-toggleon.svg';
import { ReactComponent as ToggleOffIcon } from '../../assets/svg/icons-toggleoff.svg';

import { ReactComponent as UserIcon } from '../../assets/svg/icons-user.svg';
import { ReactComponent as OperatorIcon } from '../../assets/svg/icons-operator.svg';
import { ReactComponent as MemberIcon } from '../../assets/svg/icons-members.svg';
import { ReactComponent as FreezeIcon } from '../../assets/svg/icons-freeze.svg';

import './index.scss';

interface Props {
  liveEvent: LiveEvent;
  onHostsClick?: () => void;
  onParticipantsClick?: () => void;
  onClose?: () => void;
}

export default function EventDetailView({
  liveEvent,
  onHostsClick = () => {},
  onParticipantsClick = () => {},
  onClose = () => {},
}: Props): ReactElement {
  const { openChannel } = liveEvent;
  const [title, setTitle] = useState('');
  const [frozen, setFrozen] = useState(openChannel.isFrozen as boolean);
  const [hostCount, setHostCount] = useState(liveEvent.userIdsForHost.length);
  const [participantCount, setParticipantCount] = useState(`${openChannel.participantCount}`);

  useEffect(() => {
    setTitle(openChannel.name || 'Untitled');
  }, [openChannel.name]);

  useEffect(() => {
    setHostCount(openChannel.operators.length);
  }, [liveEvent.userIdsForHost.length]);

  useEffect(() => {
    if (openChannel.participantCount > 1000) setParticipantCount(`${Math.floor(openChannel.participantCount / 1000)}k`);
    else setParticipantCount(`${openChannel.participantCount}`);
  }, [openChannel.participantCount]);

  useEffect(() => {
    setFrozen(liveEvent.openChannel.isFrozen);
  }, [openChannel.isFrozen]);

  return <div className='event-detail-view'>
    <div className='header'>
      <div className='title'>Live event information</div>
      <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60' /></div>
    </div>
    <div className='event-summary'>
      <div className='profile'>
        <UserIcon width={80} height={80} viewBox='-4 -4 20 20' fill='#fff' />
      </div>
      <div className='title'>{title}</div>
    </div>
    <div className='event-menu button' onClick={() => onHostsClick()}>
      <OperatorIcon className='icon' width={24} height={24} viewBox='-10 -10 80 80' fill='#C2A9FA' />
      <div className='label'>Hosts</div>
      <div className='count'>{hostCount}</div>
      <RightArrowIcon width={24} height={24} viewBox='-10 -10 80 80' />
    </div>
    <div className='event-menu button' onClick={() => onParticipantsClick()}>
      <MemberIcon className='icon' width={24} height={24} viewBox='-10 -10 80 80' fill='#C2A9FA' />
      <div className='label'>Participants</div>
      <div className='count'>{participantCount}</div>
      <RightArrowIcon width={24} height={24} viewBox='-10 -10 80 80' />
    </div>
    <div className='event-menu'>
      <FreezeIcon className='icon' width={24} height={24} viewBox='-10 -10 80 80' fill='#C2A9FA' />
      <div className='label'>Freeze channel</div>
      <div className='toggle'>
        {!frozen ?
          <ToggleOffIcon width={44} height={24} viewBox='2 -8 80 60' fill='#777' /> :
          <ToggleOnIcon width={44} height={24} viewBox='2 -8 80 60' fill='#C2A9FA' />}
      </div>
      <div className='guide'>Freezing a channel lets only operators to communicate in the channel.</div>
    </div>
    <div className='event-info'>
      <div className='label'>Live event ID</div>
      <div className='value'>{liveEvent.liveEventId}</div>
    </div>
    <div className='event-info'>
      <div className='label'>Created on</div>
      <div className='value'>{format(liveEvent.createdAt, 'PPp')}</div>
    </div>
    <div className='event-info'>
      <div className='label'>Created by</div>
      <div className='value'>{liveEvent.createdBy}</div>
    </div>
    <div className='event-info'>
      <div className='label'>Started on</div>
      <div className='value'>{(liveEvent.startedAt) ? format(liveEvent.startedAt, 'PPp') : ''}</div>
    </div>
    <div className='event-info'>
      <div className='label'>Started by</div>
      <div className='value'>{(liveEvent.startedBy) ? liveEvent.startedBy : ''}</div>
    </div>
  </div>;
}