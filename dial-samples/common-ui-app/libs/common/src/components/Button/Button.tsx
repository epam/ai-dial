'use client';

import classNames from 'classnames';
import { FC, MouseEvent, ReactNode } from 'react';

interface Props {
  cssClass?: string;
  disable?: boolean;
  title?: string;
  icon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<Props> = ({ title, icon, cssClass, onClick, disable }) => {
  const btnTextClassNames = classNames('small-text-semi', icon ? 'ml-2' : '');
  const btnClassNames = classNames(cssClass, 'focus-visible:outline outline-offset-0');

  return (
    <button
      type="button"
      className={btnClassNames}
      onClick={(e) => onClick?.(e)}
      disabled={disable}
      aria-label="button"
    >
      {icon}
      {title && <span className={btnTextClassNames}>{title}</span>}
    </button>
  );
};

export default Button;
