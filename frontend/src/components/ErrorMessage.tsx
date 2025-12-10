interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export default function ErrorMessage({
  title = 'Terjadi Kesalahan',
  message,
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const content = (
    <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
      <h3 className='text-lg font-semibold text-red-900 mb-2'>{title}</h3>
      <p className='text-red-700'>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'
        >
          Coba Lagi
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        {content}
      </div>
    );
  }

  return content;
}
