interface SellerStatsCardProps {
  label: string;
  value: number;
  variant: 'blue' | 'yellow' | 'green' | 'red';
}

const variantStyles = {
  blue: {
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-blue-100',
  },
  yellow: {
    gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-100',
  },
  green: {
    gradient: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-green-100',
  },
  red: {
    gradient: 'bg-gradient-to-r from-red-500 to-red-600',
    textColor: 'text-red-100',
  },
};

export default function SellerStatsCard({
  label,
  value,
  variant,
}: SellerStatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`${styles.gradient} rounded-lg shadow-lg p-6 text-white`}>
      <p className={`${styles.textColor} text-sm`}>{label}</p>
      <p className='text-3xl font-bold mt-1'>{value}</p>
    </div>
  );
}
