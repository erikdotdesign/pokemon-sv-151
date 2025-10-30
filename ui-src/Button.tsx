import React, { forwardRef } from 'react';
import { getModifierClasses } from './helpers';
import './Button.css';

type ButtonProps = {
  children?: React.ReactNode;
  modifier?: string | string[];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  modifier,
  ...props
}, ref) => {
  const modifierClasses = getModifierClasses("c-button", modifier);
  return (
    <button
      ref={ref}
      className={`c-button ${modifierClasses}`}
      {...props}>
      {children}
    </button>
  )
});

export default Button;