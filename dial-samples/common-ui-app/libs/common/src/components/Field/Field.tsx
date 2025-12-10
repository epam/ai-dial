import classNames from 'classnames';
import { FC, ReactNode } from 'react';

interface Props {
  fieldTitle?: string;
  edited?: boolean;
  htmlFor: string;
  optional?: boolean;
  optionalText?: string;
  iconAfterTitle?: ReactNode;
  cssClass?: string;
}

const Field: FC<Props> = ({ fieldTitle, htmlFor, optional, cssClass, iconAfterTitle }) => {
  return (
    <label
      className={classNames('tiny text-secondary', cssClass, !cssClass?.includes('mb') && 'mb-2')}
      htmlFor={htmlFor}
    >
      {fieldTitle && (
        <>
          <div className="flex justify-between min-h-4">
            {fieldTitle}
            {iconAfterTitle && iconAfterTitle}
          </div>
          {optional && <span className="ml-1">(Optional)</span>}
        </>
      )}
    </label>
  );
};

export default Field;
