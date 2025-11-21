'use client';

import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import Input, { InputProps } from './Input';

interface Props extends InputProps {
  iconAfterInput?: ReactNode;
  iconBeforeInput?: ReactNode;
  containerCssClass?: string;
}

export const InputWithIcon: FC<Props> = ({
  iconBeforeInput,
  iconAfterInput,
  cssClass,
  invalid,
  containerCssClass,
  ...props
}) => {
  return (
    <div
      className={classNames(
        'input input-field flex flex-row items-center p-0',
        iconAfterInput ? 'pr-2' : '',
        iconBeforeInput ? 'pl-2' : '',
        props.disabled ? 'bg-layer-3 text-secondary' : '',
        invalid ? 'input-error' : '',
        containerCssClass,
      )}
    >
      {iconBeforeInput}
      <Input cssClass={classNames('border-0 bg-transparent', cssClass)} {...props} />
      {iconAfterInput}
    </div>
  );
};
export default InputWithIcon;
