interface CardProps {
  children?: any;
  class?: string;
  title?: string;
  key?: string | number;
}

export const Card = ({ children, class: className = '', title }: CardProps) => {
  return (
    <div class={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && <h3 class="text-lg font-semibold mb-4">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};
