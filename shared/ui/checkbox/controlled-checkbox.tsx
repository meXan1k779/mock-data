import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

import type { CustomCheckboxProps } from '.';
import { CustomCheckbox } from '.';

interface ControlledCheckboxProps<TFieldValues extends FieldValues>
  extends Omit<
    CustomCheckboxProps,
    'name' | 'checked' | 'onChange' | 'onBlur' | 'ref' | 'hasError' | 'disabled'
  > {
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  disabled?: boolean;
}

export const ControlledCheckbox = <TFieldValues extends FieldValues>({
  name,
  rules,
  disabled,
  ...props
}: ControlledCheckboxProps<TFieldValues>) => {
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
    <CustomCheckbox
      {...props}
      checked={field.value ?? false}
      onChange={(e) => {
        field.onChange(e.target.checked);
      }}
      hasError={!!error}
      disabled={disabled}
    />
  );
};
