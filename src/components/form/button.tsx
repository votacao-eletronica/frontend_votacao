type ButtonProps = {
    text: string
    isLoading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

export function Button(props: ButtonProps) {
    const isDisabled = props.disabled || props.isLoading

    return (
        <button
            type={props.type ?? 'submit'}
            disabled={isDisabled}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-0 active:scale-98 ${isDisabled ? 'opacity-60 cursor-not-allowed hover:bg-indigo-600' : ''}`}
            aria-busy={props.isLoading ? 'true' : 'false'}
        >
            {props.isLoading ? 'Carregando...' : props.text}
        </button>
    )
}