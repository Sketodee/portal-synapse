import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  onClick?: () => void;
  icon?: IconType;
  text?: string;
  bgColor?: string; // Tailwind bg class
  textColor?: string; // Tailwind text class
  disabled?: boolean;
  className?: string; // Additional class names
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  icon: Icon, 
  text, 
  bgColor = 'bg-gray-900', // Default Tailwind blue color
  textColor = 'text-white',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  size = 'medium'
}) => {
  // Size class mapping
  const sizeClasses: Record<string, string> = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };

  // Base button classes
  const baseClasses = "flex items-center justify-center rounded-md font-medium transition-colors";
  
  // Conditional classes based on props
  const sizeClass = sizeClasses[size];
  const widthClass = fullWidth ? 'w-full' : '';
  const stateClasses = disabled 
    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
    : `${bgColor} ${textColor} hover:opacity-90 active:opacity-80`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClass} ${widthClass} ${stateClasses} ${className}`}
    >
      {Icon && <Icon className={`${text ? 'mr-2' : ''}`} />}
      {text}
    </button>
  );
};

export default Button;