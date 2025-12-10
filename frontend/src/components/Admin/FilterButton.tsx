type FilterType = 'all' | 'pending' | 'verified' | 'rejected';

interface FilterButtonProps {
  filter: FilterType;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  variant: 'blue' | 'yellow' | 'green' | 'red';
}

const variantStyles = {
  blue: 'bg-blue-600',
  yellow: 'bg-yellow-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
};

export default function FilterButton({
  label,
  count,
  isActive,
  onClick,
  variant,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? `${variantStyles[variant]} text-white`
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} ({count})
    </button>
  );
}
