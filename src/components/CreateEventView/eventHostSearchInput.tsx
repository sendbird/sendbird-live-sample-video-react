
import React, { ReactElement, useEffect, useState } from 'react';
import { sendbirdSelectors, useSendbirdStateContext } from '@sendbird/uikit-react';

import EventHostView, { EventHostViewProps } from './eventHostView';
import EventHostStatusView from './eventHostStatusView';

import { ReactComponent as IconSpinner } from '../../assets/svg/icons-spinner.svg';

import './index.scss';
import { DEFAULT_MAX_HOST_LENGTH } from '.';
import { UserProfile } from 'src/types';
import EventHostSearchedUserView from './eventHostSearchedUserView';

interface Props {
  initialHostUsers?: UserProfile[];
  maxHostLength?: number;
  renderCustomEventHostView?: (props: EventHostViewProps) => ReactElement;
  onUpdateHost?: (userIds: string[]) => void;
}

export default function EventHostSearchInput({
  initialHostUsers = [],
  maxHostLength = DEFAULT_MAX_HOST_LENGTH,
  renderCustomEventHostView = EventHostView,
  onUpdateHost = () => {},
}: Props): ReactElement {
  const [searchedUsers, setSearchedUsers] = useState<UserProfile[]>([]);
  const [searchVersion, setSearchVersion] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState(initialHostUsers);
  const [searchType, setSearchType] = useState('nickname');
  const [typedText, setTypedText] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const context = useSendbirdStateContext();

  useEffect(() => {
    setSelectedUsers(initialHostUsers);
  }, [initialHostUsers]);

  useEffect(() => {
    if (selectedUsers.length > maxHostLength) {
      setError(true);
      setMessage('The number of users allowed has exceeded.');
    } else {
      setError(false);
      setMessage('');
    }
  }, [selectedUsers]);

  const search = (searchType: string, keyword: string) => {
    const sb = sendbirdSelectors.getSdk(context);
    if (sb && keyword) {
      let query = null;
      switch (searchType) {
        case 'nickname': {
          query = sb.createApplicationUserListQuery({ nicknameStartsWithFilter: keyword });
          break;
        }
        case 'user ID': {
          query = sb.createApplicationUserListQuery({ userIdsFilter: [keyword] });
          break;
        }
      }
      if (query) {
        const currentSearchVersion = searchVersion + 1;
        setSearchVersion(currentSearchVersion);
        setSearching(true);
        setSearchError(false);
        query.next()
          .then(users => {
            if (currentSearchVersion >= searchVersion) {
              setSearchedUsers(users);
              setSearching(false);
              setSearchError(false);
              setSearchVersion(currentSearchVersion);
            }
          })
          .catch(err => {
            if (currentSearchVersion >= searchVersion) {
              setSearching(false);
              setSearchError(true);
              setSearchVersion(currentSearchVersion);
            }
          });
      }
    }
  };

  return <div className='event-host-form'>
    <div className='input'>
      <div className='search-type-panel'>
        <select className='search-type'
          value={searchType}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const newSearchType = event.target.value;
            setSearchType(newSearchType);
            switch (newSearchType) {
              case 'user ID':
                setMessage('Only an exact match can be found.');
                break;
              default:
                setMessage('');
            }
            setError(false);
            search(newSearchType, typedText);
          }}>
          <option value='nickname'>Nickname</option>
          <option value='user ID'>User ID</option>
        </select>
      </div>
      <div className='form'>
        {
          selectedUsers.map((user: UserProfile) => renderCustomEventHostView({
            key: user.userId,
            userId: user.userId,
            disabled: initialHostUsers.map(user => user.userId).includes(user.userId),
            nickname: user.nickname,
            profileUrl: user.profileUrl,
            onRemove: (targetUserId: string) => {
              const updatedUsers = selectedUsers.filter((user: UserProfile) => user.userId !== targetUserId);
              setSelectedUsers(updatedUsers);
              onUpdateHost(updatedUsers.map((user: UserProfile) => user.userId));
            },
          }))
        }
        <input
          type='text'
          placeholder={`Enter ${searchType}`}
          className='host-form'
          value={typedText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const keyword = event.target.value;
            setTypedText(keyword);
            search(searchType, keyword);
          }}
          />
      </div>
    </div>
    <EventHostStatusView message={message} error={error} count={selectedUsers.length} maxLength={maxHostLength} />
    {
      typedText ?
        <div className='search-result'>
          {searchedUsers.length > 0 ?
            <div className='users'>{
              searchedUsers.map((user: UserProfile) => <EventHostSearchedUserView
                key={user.userId}
                userId={user.userId}
                nickname={user.nickname}
                profileUrl={user.profileUrl}
                onClick={() => {
                  if (!selectedUsers.map(user => user.userId).includes(user.userId)) {
                    const updatedUsers = [...selectedUsers, user];
                    setSelectedUsers(updatedUsers);
                    onUpdateHost(updatedUsers.map(user => user.userId));
                  }
                  setTypedText('');
                  setSearchedUsers([]);
                  setSearchError(false);
                  setSearching(false);
                }}
              />)
            }</div> :
            <div className='status'>
              {searching ? <IconSpinner width={24} height={24} viewBox='-18 -18 100 100' fill='#333' className='spin' /> : null}
              {!searching && !searchError && searchedUsers.length === 0 ? <div className='no-result'>No matches found with {typedText}</div> : null}
              {searchError ? <div className='error'>Search request failed.</div> : null}
            </div>
          }
        </div> :
        null
    }
  </div>;
}