import { LiveEvent } from "@sendbird/live";
import React, { useEffect, useState } from "react";

export default function Duration(props: { liveEvent: LiveEvent }) {
  const {
    liveEvent,
  } = props;

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(liveEvent.duration);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  function getHHMMSS(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }

  return (
    <div className="control-bar__duration">{getHHMMSS(duration)}</div>
  );
}