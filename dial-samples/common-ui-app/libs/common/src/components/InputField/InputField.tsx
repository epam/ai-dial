'use client';

import { FC, ReactNode } from 'react';

import ErrorText from '@/custom-app-ui/common/src/components/ErrorText/ErrorText';
import Field from '@/custom-app-ui/common/src/components/Field/Field';
import { InputWithIcon } from '@/custom-app-ui/common/src/components/Input/InputWithIcon';
import { FieldControlProps } from '@/custom-app-ui/common/src/models/field-control-props';

export interface InputFieldBaseProps extends FieldControlProps {
  placeholder?: string;
  value?: string | number;
  elementId: string;
  elementCssClass?: string;
  containerCssClass?: string;
  disabled?: boolean;
  invalid?: boolean;
  errorText?: string;
  iconAfterInput?: ReactNode;
  iconBeforeInput?: ReactNode;
  iconAfterTitle?: ReactNode;
  labelCssClass?: string;
}

export interface InputFieldProps extends InputFieldBaseProps {
  type: string;
  onChange?: (value: string | number) => void;
}

const InputField: FC<InputFieldProps> = ({
  fieldTitle,
  errorText,
  optional,
  elementCssClass,
  containerCssClass,
  elementId,
  iconAfterTitle,
  labelCssClass,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <Field
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
        iconAfterTitle={iconAfterTitle}
        cssClass={labelCssClass}
      />
      <InputWithIcon inputId={elementId} containerCssClass={containerCssClass} cssClass={elementCssClass} {...props} />
      <ErrorText errorText={errorText} />
    </div>
  );
};

export interface NumberInputFieldProps extends InputFieldBaseProps {
  onChange?: (value: number) => void;
}

export const NumberInputField: FC<NumberInputFieldProps> = ({ onChange, value, ...props }) => {
  return <InputField type="number" onChange={(v) => onChange?.(Number(v))} value={value} {...props} />;
};

export interface TextInputFieldProps extends InputFieldBaseProps {
  onChange?: (value: string) => void;
}

export const TextInputField: FC<TextInputFieldProps> = ({ onChange, ...props }) => {
  return <InputField type="text" onChange={(v) => onChange?.(v as string)} {...props} />;
};
