import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import type { RadioGroupProps } from '.';
import { RadioGroup } from '.';

interface ControlledRadioGroupProps<TFieldValues extends FieldValues>
  extends Omit<RadioGroupProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'error'> {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledRadioGroup = <TFieldValues extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledRadioGroupProps<TFieldValues>) => {
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
    <RadioGroup
      {...props}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error}
    />
  );
};
