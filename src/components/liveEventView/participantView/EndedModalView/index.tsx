import React from "react";

import './index.scss';
import { ReactComponent as CloseIcon } from "../../../../assets/svg/icons-close.svg";

interface EndedModalViewProps {
  onClose: () => void;
}

export default function EndedModalView(props: EndedModalViewProps) {
  const {
    onClose
  } = props;

  return (
    <div className='ended-modal'>
      <div className='header'>
        <div className='title'>Host has ended this live event.</div>
        <div className='close' onClick={onClose}>
          <CloseIcon width={22} height={22} viewBox='0 0 60 60' fill='#000' />
        </div>
      </div>
      <div className='buttons'>
        <div className='major-button' onClick={onClose}>End live</div>
      </div>
    </div>
  );
}
