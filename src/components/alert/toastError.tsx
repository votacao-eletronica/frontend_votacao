import type { ToastContentProps } from "react-toastify";

type ToastErrorProps = ToastContentProps<{
  title: string;
  content: string;
}>;

export function ToastError({
  data,
}: ToastErrorProps) {
  return (
    <div className="flex flex-col w-full">
      <h3
        className='text-sm font-semibold text-white'
      >
        {data.title}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-sm">{data.content}</p>
      </div>
    </div>
  );
}