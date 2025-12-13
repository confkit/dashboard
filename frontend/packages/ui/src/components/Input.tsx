interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  disabled?: boolean;
  class?: string;
  label?: string;
}

export const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  class: className = '',
  label,
}: InputProps) => {
  return (
    <div class="flex flex-col gap-1">
      {label && <label class="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        class={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
        on:input={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
};
