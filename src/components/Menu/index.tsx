import { Fragment, MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { useToggle } from 'react-use';
import React from 'react';

import './index.scss';

export const useOnClickOutside = (handler: () => void) => {
  const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    // @ts-ignore
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // @ts-ignore
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  return ref;
};

export type TMenuItem = {
  label: string;
  element?: ReactNode;
  handleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

type MenuItemProps = {
  item: TMenuItem;
  toggleOpened: () => void;
};

const MenuItem = ({
                    item: {
                      label,
                      element,
                      handleClick = () => {},
                      disabled = false,
                    }, toggleOpened
                  }: MenuItemProps) => (
  <button className="menu__item-wrapper" type="button" onClick={(e) => {
    toggleOpened();
    handleClick(e)
  }} disabled={disabled}>
    {element || label}
  </button>
);

type MenuProps = {
  items: TMenuItem[];
  Dropdown: React.FC<any>; // TODO: Remove any
  Divider?: React.FC;
  disabled?: boolean;
};

const Menu = ({ items, Dropdown, Divider, disabled }: MenuProps) => {
  const [opened, toggleOpened] = useToggle(false);
  const ref = useOnClickOutside(() => toggleOpened(false));

  return (
    <div className="menu__wrapper" ref={ref}>
      <Dropdown onClick={() => { if (!disabled) toggleOpened(); }} />
      {opened && (
        <div className="menu__menu-items">
          {items.map((item, i) => (
            <Fragment key={item.label}>
              <MenuItem item={item} toggleOpened={toggleOpened} />
              {
                Divider && i < items.length - 1
                && <Divider />
              }
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
