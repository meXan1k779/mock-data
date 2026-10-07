import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import { PhoneInput } from '.';

interface ControlledPhoneInputProps<TFieldValues extends FieldValues>
  extends Omit<
    React.ComponentProps<typeof PhoneInput>,
    'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'error'
  > {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledPhoneInput = <TFieldValues extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledPhoneInputProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  const {
    field: { ref, value, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return <PhoneInput {...props} {...field} value={value ?? ''} ref={ref} error={error} />;
};
