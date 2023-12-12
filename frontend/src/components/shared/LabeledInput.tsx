import { ComponentPropsWithoutRef, useId } from 'react';

interface LabeledInputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}

export function LabeledInput({ label, ...props }: LabeledInputProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        className={props.className ? props.className : ''}
        id={id}
      />
    </div>
  );
}
