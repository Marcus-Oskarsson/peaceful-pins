import { ComponentPropsWithoutRef } from 'react';

import './Button.scss';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'success' | 'danger';
  disabled?: false;
  size?: 'small' | 'large';
}

interface ButtonPropsDisabled extends ComponentPropsWithoutRef<'button'> {
  variant: 'disabled';
  disabled: true;
  size?: 'small' | 'large';
}

export function Button({
  variant = 'primary',
  size = 'large',
  disabled = false,
  ...props
}: ButtonProps | ButtonPropsDisabled) {
  return (
    <button
      {...props}
      className={`btn btn-${variant} btn-${size} ${
        props.className ? props.className : ''
      }`}
      disabled={disabled}
    />
  );
}
