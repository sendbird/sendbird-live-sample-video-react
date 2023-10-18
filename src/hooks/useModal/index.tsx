// idea from https://github.com/shibe97/react-hooks-use-modal
import React, { useState, useCallback, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { MODAL_ROOT } from "./modalRoot";

import './index.scss';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  close: () => void;
  modalRoot?: string;
  className: string;
  modalClassName?: string;
}

const Modal = (
  {
    children,
    isOpen = false,
    close,
    modalRoot = MODAL_ROOT,
    className = '',
    modalClassName = '',
  }: ModalProps
) => {
  if (!isOpen) {
    return null;
  }

  const root = document.getElementById(modalRoot);

  return createPortal(
    <div className={`sendbird-modal__wrapper ${className}`}>
      <div className="sendbird-modal__mask" />
      <div className={`sendbird-modal__container ${modalClassName}`}>{children}</div>
    </div>,
    root!,
  );
};

const useModal = (className: string, modalClassName?: string): [({ children }: { children: React.ReactNode }) => ReactElement, () => void, () => void] => {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
    <Modal isOpen={isOpen} close={close} className={className} modalClassName={modalClassName}>
      {children}
    </Modal>
  );

  return [ModalWrapper, open, close];
};

export default useModal;
