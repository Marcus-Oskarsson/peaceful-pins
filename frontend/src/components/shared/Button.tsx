import { ComponentPropsWithoutRef } from 'react';

export type Variants = 'primary' | 'success' | 'cancel';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'success' | 'cancel';
  disabled?: false;
}

interface ButtonPropsDisabled extends ComponentPropsWithoutRef<'button'> {
  variant: 'disabled';
  disabled: true;
}

export function Button({
  variant = 'primary',
  disabled = false,
  ...props
}: ButtonProps | ButtonPropsDisabled) {
  return (
    <button
      {...props}
      className={`${variant} ${props.className ? props.className : ''}`}
      disabled={disabled}
    />
  );
}
