
import React, { ReactElement } from 'react';

import './index.scss';

import { ReactComponent as UserIcon } from '../../assets/svg/icons-user.svg';

interface Props {
  key: string;
  userId: string;
  nickname?: string;
  profileUrl?: string;
}

export default function UserView({
  nickname = '',
  profileUrl = '',
}: Props): ReactElement {
  const profile = profileUrl ?
    <img src={profileUrl} className='profile-image' /> :
    <UserIcon fill='#fff' className='profile-image' />;
  return <div className='user-view'>
    {profile}
    <div className='nickname'>{nickname}</div>
  </div>
}