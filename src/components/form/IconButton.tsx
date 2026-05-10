import type { ReactNode } from 'react'

type IconButtonProps = {
    icon: ReactNode
    onClick?: (e: any) => void
    title?: string
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit' | 'reset'
}

export function IconButton(props: IconButtonProps) {
    const variant = props.variant ?? 'primary'
    const isDisabled = props.disabled

    const baseClasses = 'p-2 rounded transition-colors focus:outline-none focus:ring-0'
    const disabledClasses = isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'

    const variantClasses = {
        primary: `text-blue-500 hover:bg-blue-100 ${isDisabled ? 'hover:bg-transparent' : ''}`,
        secondary: `text-gray-500 hover:bg-gray-100 ${isDisabled ? 'hover:bg-transparent' : ''}`,
        danger: `text-red-500 hover:bg-red-100 ${isDisabled ? 'hover:bg-transparent' : ''}`
    }

    return (
        <button
            type={props.type ?? 'button'}
            onClick={props.onClick}
            disabled={isDisabled}
            title={props.title}
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
        >
            {props.icon}
        </button>
    )
}