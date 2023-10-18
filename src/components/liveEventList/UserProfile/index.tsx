import React, { useContext } from "react";
import Menu from "../../Menu";
import { ReactComponent as IconUser } from "../../../assets/svg/icons-user.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/svg/icons-settings-filled.svg";

import './index.scss';
import { SendbirdLiveContext } from "../../../lib/sendbirdLiveContext";

interface UserProfileProps {
  profileUrl?: string;
  userId?: string;
  nickname?: string;
  onClickSettings?: () => void;
  onClickSignOut?: () => void;
}

export default function UserProfile(props: UserProfileProps) {
  const {
    profileUrl,
    userId,
    nickname,
  } = props;

  const { signOut } = useContext(SendbirdLiveContext);

  return (
    <div className="user-profile">
      <div className="user-profile__avatar">
        {
          profileUrl ?
            <img src={profileUrl} /> :
            <IconUser fill='#fff' width={32} height={32}  />
        }
      </div>
      <div className="user-profile__info__wrapper">
        <div className="user-profile__nickname">{nickname ?? '-'}</div>
        <div className="user-profile__user-id">User ID: {userId}</div>
      </div>
      <Menu
        items={[
          {
            label: 'Sign out',
            handleClick: () => { signOut() },
          },
        ]}
        Dropdown={props => <SettingsIcon {...props} viewBox="0 0 64 64" className="user-profile__settings" width={22} height={22} fill={'#742DDD'}/>}
      />
    </div>
  );
}