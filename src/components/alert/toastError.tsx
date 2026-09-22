type ToastErrorProps = {
  title: string;
  content: string;
};

export function ToastError({
  title,
  content,
}: ToastErrorProps) {
  return (
    <div className="flex flex-col w-full">
      <h3
        className='text-sm font-semibold text-white'
      >
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}
