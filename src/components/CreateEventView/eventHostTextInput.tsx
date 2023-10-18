
import React, { ReactElement, useEffect, useState } from 'react';

import EventHostView, { EventHostViewProps } from './eventHostView';
import EventHostStatusView from './eventHostStatusView';

import './index.scss';
import { DEFAULT_MAX_HOST_LENGTH } from '.';
import { UserProfile } from 'src/types';

interface Props {
  initialHostUsers?: UserProfile[];
  maxHostLength?: number;
  renderCustomEventHostView?: (props: EventHostViewProps) => ReactElement;
  onUpdateHost?: (userIds: string[]) => void;
}

export default function EventHostTextInput({
  initialHostUsers = [],
  maxHostLength = DEFAULT_MAX_HOST_LENGTH,
  renderCustomEventHostView = EventHostView,
  onUpdateHost = () => {},
}: Props): ReactElement {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [typedText, setTypedText] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setSelectedUserIds(initialHostUsers.map(user => user.userId));
  }, [initialHostUsers]);

  useEffect(() => {
    if (selectedUserIds.length > maxHostLength) {
      setError(true);
      setMessage('The number of users allowed has exceeded.');
    } else {
      setError(false);
      setMessage('If the ACL attributes are turned on, you can access user list information from the SDK.');
    }
  }, [selectedUserIds]);

  return <div className='event-host-form'>
    <div className='input'>
      <div className='form'>
        {
          selectedUserIds.map((userId: string) => renderCustomEventHostView({
            key: userId,
            userId: userId,
            disabled: initialHostUsers.map(user => user.userId).includes(userId),
            nickname: userId,
            hideProfile: true,
            onRemove: (targetUserId: string) => {
              const updatedUserIds = selectedUserIds.filter((userId: string) => userId !== targetUserId);
              setSelectedUserIds(updatedUserIds);
              onUpdateHost(updatedUserIds);
            },
          }))
        }
        <input
          type='text'
          placeholder='Separate each user ID with a comma.'
          className='host-form'
          value={typedText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            const userIds = inputValue.split(',');
            setTypedText(userIds.pop() ?? '');

            const addedUserIds = userIds.filter((userId: string, index: number) =>
              userId.length > 0
              && !selectedUserIds.includes(userId)
              && userIds.indexOf(userId) === index);

            if (addedUserIds.length > 0) {
              const newlySelectedUserIds = [
                ...selectedUserIds,
                ...addedUserIds,
              ];
              setSelectedUserIds(newlySelectedUserIds);
              onUpdateHost(newlySelectedUserIds);
            }
          }}
          />
      </div>
    </div>
    <EventHostStatusView message={message} error={error} count={selectedUserIds.length} maxLength={maxHostLength} />
  </div>;
}