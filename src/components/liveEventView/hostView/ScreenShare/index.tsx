import React, { useState } from "react";
import { LiveEvent } from "@sendbird/live";
import { ReactComponent as CloseIcon } from "../../../../assets/svg/icons-close.svg";
import { ReactComponent as BottomRightIcon } from "../../../../assets/svg/icons-screen-share-bottom-right.svg";
import { ReactComponent as BottomLeftIcon } from "../../../../assets/svg/icons-screen-share-bottom-left.svg";
import { ReactComponent as TopRightIcon } from "../../../../assets/svg/icons-screen-share-top-right.svg";
import { ReactComponent as TopLeftIcon } from "../../../../assets/svg/icons-screen-share-top-left.svg";
import { ReactComponent as HiddenIcon } from "../../../../assets/svg/icons-screen-share-hidden.svg";

import './index.scss';

interface ScreenShareProps {
  liveEvent: LiveEvent;
  onClose: () => void;
}

export default function ScreenShare(props: ScreenShareProps) {
  const {
    liveEvent,
    onClose,
  } = props;

  const CameraOverlayPosition = {
    'TOP_LEFT': 'top_left',
    'TOP_RIGHT': 'top_right',
    'BOTTOM_LEFT': 'bottom_left',
    'BOTTOM_RIGHT': 'bottom_right',
    'HIDDEN': 'hidden',
  };

  const [position, setPosition] = useState(CameraOverlayPosition.BOTTOM_RIGHT);

  return (
    <div className="screen-share">
      <div className='close' onClick={() => onClose()}>
        <CloseIcon width={22} height={22} viewBox='0 0 60 60' />
      </div>
      <div className='title'>Share screen</div>
      <div className="screen-share__label">Preview</div>
      <div className="screen-share__preview__container">
        <div className="screen-share__preview__screen">
          <div className={`screen-share__preview__camera--${position}`}>
            Camera
          </div>
          <p>The screen you chose to share will be shown here.</p>
        </div>
      </div>
      <div className="screen-share__label">Layout</div>
      <div className="screen-share__layout-container">
        <BottomRightIcon width={32} height={32} fill="#000" onClick={() => setPosition(CameraOverlayPosition.BOTTOM_RIGHT)} />
        <BottomLeftIcon width={32} height={32} fill="#000" onClick={() => setPosition(CameraOverlayPosition.BOTTOM_LEFT)} />
        <TopRightIcon width={32} height={32} fill="#000" onClick={() => setPosition(CameraOverlayPosition.TOP_RIGHT)} />
        <TopLeftIcon width={32} height={32} fill="#000" onClick={() => setPosition(CameraOverlayPosition.TOP_LEFT)} />
        <HiddenIcon width={32} height={32} fill="#000" onClick={() => setPosition(CameraOverlayPosition.HIDDEN)} />
      </div>
      <div className='buttons'>
        <div className='minor-button' onClick={() => onClose()}>Cancel</div>
        <div className='major-button' onClick={async () => {
          await liveEvent.setScreenShareOptions({
            // @ts-ignore
            cameraOverlayPosition: position,
          });
          onClose();
        }}>Save</div>
      </div>
    </div>
  )
}