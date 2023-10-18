
import React, { ReactElement } from 'react';

import './index.scss';

interface Props {
  body: ReactElement;
  backgroundColor?: string;
}

export default function DimBackground({
  body,
  backgroundColor = 'rgba(33, 33, 33, 0.5)',
  }: Props): ReactElement {
  return <div className='dim-background' style={{ backgroundColor }}>{body}</div>;
}