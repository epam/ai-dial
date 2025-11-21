'use client';

import { FC } from 'react';
import classNames from 'classnames';

import LoaderIcon from '../../../public/images/icons/loader.svg';

interface Props {
  size?: number;
  loaderClassName?: string;
  containerClassName?: string;
}

const Loader: FC<Props> = ({ size = 18, loaderClassName = '', containerClassName = '' }) => {
  return (
    <div
      className={classNames('flex w-full items-center justify-center text-secondary', containerClassName || 'h-full')}
    >
      <LoaderIcon
        height={size}
        width={size}
        className={classNames('shrink-0 grow-0 basis-auto animate-spin-steps', loaderClassName)}
      />
    </div>
  );
};

export default Loader;
