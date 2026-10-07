import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import { DateInput } from '.';

interface ControlledDateInputProps<TFieldValues extends FieldValues>
  extends Omit<
    React.ComponentProps<typeof DateInput>,
    'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'error'
  > {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledDateInput = <TFieldValues extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledDateInputProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  const {
    field: { ref, value, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return <DateInput {...props} {...field} value={value ?? ''} ref={ref} error={error} />;
};
