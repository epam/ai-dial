'use client';

import classNames from 'classnames';
import { FC } from 'react';

interface Props {
  value?: string | number;
  placeholder?: string;
  textareaId: string;
  cssClass?: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Textarea: FC<Props> = ({
  value,
  textareaId,
  placeholder,
  cssClass = '',
  disabled,
  invalid,
  onChange,
  onKeyDown,
}) => {
  return (
    <textarea
      id={textareaId}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      className={classNames(invalid ? 'input-error' : '', cssClass)}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      onKeyDown={onKeyDown}
    />
  );
};

export default Textarea;
