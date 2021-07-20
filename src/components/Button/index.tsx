import React from 'react';

import './style.css';

interface Props {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

function Button({ label, onClick, className, type, disabled }: Props) {
  return (
    <button
      className={`button ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Button;
