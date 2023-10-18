
import React, { ReactElement } from 'react';

import './index.scss';
import { ReactComponent as IconUser } from '../../assets/svg/icons-user.svg';

interface Props {
  key: string;
  userId: string;
  nickname: string;
  profileUrl: string;
  onClick?: () => void;
}

export default function EventHostSearchedUserView({
  userId,
  nickname = '',
  profileUrl = '',
  onClick = () => {},
}: Props): ReactElement {
  const profile = profileUrl ?
    <img src={profileUrl} className='profile-image' /> :
    <IconUser fill='#fff' className='profile-image' />;
  return <div className='searched-user' onClick={() => onClick()}>
    {profile}
    <div className='info'>
      <div className='nickname'>{nickname}</div>
      <div className='user-id'>{userId}</div>
    </div>
  </div>;
}