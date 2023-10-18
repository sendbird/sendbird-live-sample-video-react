
import React from 'react';

import { ReactComponent as InfoIcon } from '../../assets/svg/icons-info.svg';

interface Props {
  message: string;
  count: number;
  maxLength: number;
  error?: boolean;
}

export default function EventHostStatusView({
  message,
  count,
  maxLength,
  error = false,
}: Props) {
  return <div className='event-host-status'>
    <div className={`message ${error ? 'error' : ''}`}>{message}</div>
    <div className='count'><span className={`value ${error ? 'error' : ''}`}>{count}</span> / {maxLength} users</div>
    <InfoIcon width={24} height={24} viewBox='-32 0 100 100' fill='#666' />
  </div>;
}