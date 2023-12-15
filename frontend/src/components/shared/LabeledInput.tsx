import { ComponentPropsWithoutRef, useId } from 'react';

import './LabeledInput.scss';

interface LabeledInputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}

export function LabeledInput({ label, ...props }: LabeledInputProps) {
  const id = useId();

  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        className={props.className ? props.className : ''}
        id={id}
      />
    </div>
  );
}
