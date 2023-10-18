import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { sendbirdSelectors, useSendbirdStateContext } from '@sendbird/uikit-react';
import { v4 as uuid } from 'uuid';

import EventHostSearchInput from './eventHostSearchInput';
import EventHostTextInput from './eventHostTextInput';
import EventHostView, { EventHostViewProps } from './eventHostView';

import { ReactComponent as LiveIcon } from '../../assets/svg/icons-live.svg';
import { ReactComponent as CloseIcon } from '../../assets/svg/icons-close.svg';

import './index.scss';
import { UserProfile } from 'src/types';
import { LiveEventType, LiveEvent, SendbirdLive } from "@sendbird/live";
import { SendbirdLiveContext } from "../../lib/sendbirdLiveContext";

export interface CreateEventViewProps {
  disableAcl?: boolean;
  showUserIdsForHostSelectionView?: boolean;
  renderCustomEventHostView?: (props: EventHostViewProps) => ReactElement;
  onClose?: (liveEvent?: LiveEvent) => void;
}

export const DEFAULT_MAX_HOST_LENGTH = 10;

export default function CreateEventView({
  showUserIdsForHostSelectionView = true,
  disableAcl = false,
  renderCustomEventHostView = EventHostView,
  onClose = () => {},
}: CreateEventViewProps): ReactElement {
  const [title, setTitle] = useState('');
  const [coverImagePath, setCoverImagePath] = useState('');
  const coverImage = useRef<HTMLImageElement>(null);
  const coverImageFile = useRef<HTMLInputElement>(null);

  const { stringSet } = useContext(SendbirdLiveContext);
  const context = useSendbirdStateContext();
  const sb = sendbirdSelectors.getSdk(context);
  
  const [initialHostUsers, setInitialHostUsers] = useState<UserProfile[]>([]);
  useEffect(() => {
    if (showUserIdsForHostSelectionView) {
      if (sb?.currentUser) {
        setInitialHostUsers([sb.currentUser]);
      }
    }
  }, [sb?.currentUser]);

  const [hostUserIds, setHostUserIds] = useState(initialHostUsers.map(user => user.userId));

  return <div className='create-event-view'>
    <div className='close' onClick={() => onClose()}><CloseIcon width={22} height={22} viewBox='0 0 60 60' /></div>
    <div className='title'>{stringSet.LIVE_EVENT_CREATE_HEADER_TITLE}</div>
    <div className='section-title'>{stringSet.LIVE_EVENT_CREATE_EVENT_TITLE}</div>
    <div>
      <input type='text'
        placeholder={stringSet.LIVE_EVENT_CREATE_EVENT_TITLE_PLACEHOLDER}
        className='title-form'
        value={title}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTitle(event.target.value);
        }} />
    </div>
    <div className='section-title'>{stringSet.LIVE_EVENT_CREATE_EVENT_COVER_IMAGE_TITLE}</div>
    <div className='cover-image-box'>
      <div className='cover-image-container' ref={coverImage}>
        {!coverImagePath ?
          <LiveIcon viewBox='0 0 64 64' width={32} height={32} fill='#fff' /> :
          <img src={coverImagePath} alt='Cover image' className='cover-image' />}
      </div>
      <input type='file'
        className='cover-image-file'
        ref={coverImageFile}
        accept={'image/*'}
        onChange={() => {
          const target = coverImageFile.current;
          const files = target?.files ?? [];
          if (files.length === 1) {
            const reader = new FileReader();
            reader.onload = () => {
              if (coverImage.current) {
                setCoverImagePath(reader.result as string);
              }
            };
            reader.readAsDataURL(files[0]);
          }
        }} />
      <div className='cover-image-upload'
        onClick={() => {coverImageFile.current!.click()}}>{stringSet.LIVE_EVENT_CREATE_EVENT_COVER_IMAGE_BUTTON}</div>
      <div className='cover-image-remove' onClick={() => {
        if (coverImageFile.current) coverImageFile.current.value = '';
        setCoverImagePath('');
      }}>{ (coverImageFile.current?.files?.length) ? stringSet.REMOVE_IMAGE : ''}</div>
    </div>
    <div className='section-title'>{stringSet.LIST_USERS_FOR_HOST_HEADER_TITLE}</div>
      {!disableAcl ?
        <EventHostSearchInput
          initialHostUsers={initialHostUsers}
          renderCustomEventHostView={renderCustomEventHostView}
          onUpdateHost={(userIds: string[]) => setHostUserIds(userIds)} /> :
        <EventHostTextInput
          initialHostUsers={initialHostUsers}
          renderCustomEventHostView={renderCustomEventHostView}
          onUpdateHost={(userIds: string[]) => setHostUserIds(userIds)} />}
    <div className='button-box'>
      <input type='button' className='minor-button' value='Cancel' onClick={() => onClose()} />
      <input type='button' className='major-button' value={stringSet.LIVE_EVENT_CREATE_HEADER_BUTTON} onClick={async () => {
        const file = coverImageFile?.current?.files?.[0];
        let newFile = null;
        if (file) {
          const blob = file.slice(0, file.size, file.type);
          newFile = new File(
            [blob],
            `${uuid()}.${file.type.split('/').pop()}`,
            { type: file.type }
          );
        }

        const liveEvent = await SendbirdLive.createLiveEvent({
          userIdsForHost: [ ...hostUserIds ],
          title: title,
          coverFile: newFile ?? undefined,
          type: LiveEventType.LIVE_EVENT_FOR_VIDEO,
        });
        await liveEvent.enterAsHost({turnAudioOn: true, turnVideoOn: true});
        onClose(liveEvent);
      }} />
    </div>
  </div>;
}