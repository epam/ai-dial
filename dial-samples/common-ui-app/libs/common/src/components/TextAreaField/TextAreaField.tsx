'use client';

import { FC } from 'react';

import Field from '@/custom-app-ui/common/src/components/Field/Field';
import ErrorText from '@/custom-app-ui/common/src/components/ErrorText/ErrorText';
import { InputFieldBaseProps } from '@/custom-app-ui/common/src/components/InputField/InputField';
import Textarea from '@/custom-app-ui/common/src/components/Textarea/Textarea';

export interface Props extends InputFieldBaseProps {
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField: FC<Props> = ({ fieldTitle, optional, elementId, elementCssClass, iconAfterTitle, ...props }) => {
  return (
    <div className="flex flex-col">
      <Field fieldTitle={fieldTitle} optional={optional} htmlFor={elementId} iconAfterTitle={iconAfterTitle} />
      <Textarea textareaId={elementId} cssClass={elementCssClass} {...props} />
      <ErrorText />
    </div>
  );
};

export default TextAreaField;
