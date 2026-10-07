import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import type { SelectProps } from '.';
import { Select } from '.';

interface ControlledSelectProps<TFieldValues extends FieldValues>
  extends Omit<SelectProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'error'> {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledSelect = <TFieldValues extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledSelectProps<TFieldValues>) => {
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
    <Select
      {...props}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error}
    />
  );
};
