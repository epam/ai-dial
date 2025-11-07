import { FC } from 'react';

interface Props {
  errorText?: string;
}

const ErrorText: FC<Props> = ({ errorText }) => {
  return errorText && <span className="text-error tiny mt-1">{errorText}</span>;
};

export default ErrorText;
