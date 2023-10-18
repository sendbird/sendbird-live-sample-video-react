
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { UserProfile } from 'src/types';

import { ReactComponent as CloseIcon } from '../../assets/svg/icons-close.svg';

import './index.scss';
import UserView from './userView';

export interface UserQueryResult {
  result: UserProfile[];
  hasNext: boolean;
}

interface Props {
  title: string;
  count: number;
  query: () => Promise<UserQueryResult>;
  onClose?: () => void;
}

export default function UserListView({
  title,
  count,
  query,
  onClose = () => {},
}: Props): ReactElement {
  const userList = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    query()
      .then(({ result, hasNext }) => {
        setUsers([...result]);
        setHasNext(hasNext);
      });
  }, []);

  const onScroll = () => {
    if (userList.current) {
      const { scrollTop, scrollHeight, clientHeight } = userList.current;
      if (scrollTop + clientHeight === scrollHeight) {
        if (hasNext) {
          query()
            .then(({ result, hasNext }) => {
              setUsers([...users, ...result]);
              setHasNext(hasNext);
            });
        }
      }
    }
  };

  return <div className='user-list-view'>
    <div className='header'>
      <div className='title'>{title} <span className='count'>{count}</span></div>
      <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60' /></div>
    </div>
    <div className='list' ref={userList} onScroll={onScroll}>{
      users.map((user: UserProfile) => <UserView
        key={user.userId}
        userId={user.userId}
        nickname={user.nickname}
        profileUrl={user.profileUrl} />)
    }</div>
  </div>;
}