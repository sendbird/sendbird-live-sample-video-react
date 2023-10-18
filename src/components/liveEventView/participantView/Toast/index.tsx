import React, { ReactElement, useState } from "react";

interface ToastProps {
  message?: string,
}

const Toast = (props: ToastProps) => {
  const {
    message,
  } = props;

  return (
    <div className="toast-container">
      {message && <div className="toast">{ message }</div>}
    </div>
  );
};

export const useToast = (): [({ message }: ToastProps) => ReactElement, (message: string, time?: number) => void, () => void] => {
  const [message, setMessage] = useState<undefined | string>(undefined);
  const [timer, setTimer] = useState<undefined | ReturnType<typeof setTimeout>>(undefined);

  const notify = (message: string, time: number = 1000000) => {
    setMessage(message);
    const timer = setTimeout(() => {
      reset();
    }, time);

    setTimer(timer);
  }

  const reset = () => {
    clearTimeout(timer);
    setTimer(undefined);
    setMessage(undefined);
  }

  const ToastWrapper = () => (
    <Toast message={message}/>
  )

  return [ToastWrapper, notify, reset];
}
