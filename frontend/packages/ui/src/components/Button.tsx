interface ButtonProps {
  children?: any;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
  class?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  class: className = '',
}: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      on:click={onClick}
      disabled={disabled}
      class={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
