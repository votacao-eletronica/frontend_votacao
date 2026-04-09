type ButtonProps = {
    text: string
    isLoading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    onClick?: () => void
}

export function Button(props: ButtonProps) {
    const isDisabled = props.disabled || props.isLoading
    const variant = props.variant ?? 'primary'

    const baseClasses = 'py-2 px-4 rounded-md cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 active:scale-98'
    const disabledClasses = isDisabled ? 'opacity-60 cursor-not-allowed' : ''

    const variantClasses = {
        primary: `bg-indigo-600 text-white hover:bg-indigo-700 ${isDisabled ? 'hover:bg-indigo-600' : ''}`,
        secondary: `bg-gray-300 text-gray-700 hover:bg-gray-400 ${isDisabled ? 'hover:bg-gray-300' : ''}`,
        danger: `bg-red-600 text-white hover:bg-red-700 ${isDisabled ? 'hover:bg-red-600' : ''}`
    }

    return (
        <button
            type={props.type ?? 'submit'}
            disabled={isDisabled}
            onClick={props.onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
            aria-busy={props.isLoading ? 'true' : 'false'}
        >
            {props.isLoading ? 'Carregando...' : props.text}
        </button>
    )
}