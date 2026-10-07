import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import type { PasswordFieldProps } from './password-field';
import { PasswordField } from './password-field';

interface ControlledTextFieldProps<TFieldValues extends FieldValues>
  extends Omit<PasswordFieldProps, 'name' | 'value' | 'onChange'> {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledPasswordField = <TFieldValues extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledTextFieldProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <PasswordField
      {...props}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={() => {
        props.onBlur?.();
        field.onBlur();
      }}
      error={error}
    />
  );
};
