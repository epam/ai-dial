'use client';

import classNames from 'classnames';
import { FC } from 'react';

export interface InputProps {
  type?: string;
  value?: string | number;
  placeholder?: string;
  inputId: string;
  cssClass?: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (value: string) => void;
}

const Input: FC<InputProps> = ({
  value,
  inputId,
  placeholder = '',
  cssClass = '',
  type = 'text',
  invalid = false,
  disabled,
  onChange,
}) => {
  return (
    <input
      type={type}
      autoComplete="new-password"
      id={inputId}
      placeholder={placeholder}
      value={value || ''}
      className={classNames(invalid ? 'input-error' : '', cssClass)}
      disabled={disabled}
      onChange={(event) => onChange?.(event.currentTarget.value)}
    />
  );
};

export default Input;
