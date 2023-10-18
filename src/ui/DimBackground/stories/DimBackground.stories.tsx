
import React from 'react';
import DimBackground from '../index';

export default { title: 'UI Components/DimBackground' };

const sampleStyle = {
  width: 480,
  height: 360,
  background: '#fff',
  padding: 20,
  borderRadius: 8,
}

export const simpleDimBackground = () => (
  <DimBackground body={<div style={sampleStyle}>Hello world</div>} />
);

export const coloredDimBackground = () => (
  <DimBackground body={<div style={sampleStyle}>Hello world</div>} backgroundColor={'rgba(33, 33, 33, 0.7)'} />
);