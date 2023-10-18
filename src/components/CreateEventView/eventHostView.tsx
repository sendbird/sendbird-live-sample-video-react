
import React, { ReactElement } from 'react';

import './index.scss';
import { ReactComponent as UserIcon } from '../../assets/svg/icons-user.svg';
import { ReactComponent as CloseIcon } from '../../assets/svg/icons-close.svg';

export interface EventHostViewProps {
  key: string;
  userId: string;
  disabled: boolean;
  nickname?: string;
  profileUrl?: string;
  hideProfile?: boolean;
  onRemove?: (userId: string) => void;
}

export default function EventHostView({
  key,
  userId,
  disabled = false,
  nickname = '',
  profileUrl = '',
  hideProfile = false,
  onRemove = () => {},
}: EventHostViewProps): ReactElement {
  const profile = profileUrl ?
    <img src={profileUrl} className='profile-image' /> :
    <UserIcon fill='#ccc' className='profile-image' />;
  return <div className='event-host' key={key}>
    {!hideProfile ? profile : null}
    <div className='nickname'>{nickname}</div>
    <div className='remove-button' onClick={() => { if (!disabled) onRemove(userId) }}>
      <CloseIcon viewBox="0 -17 100 100" fill='#888' width={18} height={18} />
    </div>
  </div>;
}