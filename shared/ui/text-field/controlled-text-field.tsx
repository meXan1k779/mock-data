import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import { TextField, type FloatingLabelInputProps } from './text-field';

interface TextFieldProps<TFieldValues extends FieldValues>
  extends Omit<
    FloatingLabelInputProps,
    'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'error'
  > {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledTextField = <TFieldValues extends FieldValues>({
  name,
  rules,
  ...props
}: TextFieldProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  const {
    field: { ref, value, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return <TextField {...props} {...field} value={value ?? ''} ref={ref} error={error} />;
};
