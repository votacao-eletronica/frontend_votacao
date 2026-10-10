import type { ReactNode } from 'react'
import { CircleNotch } from 'phosphor-react'

type ButtonProps = {
    text: string
    icon?: ReactNode
    isLoading?: boolean
    disabled?: boolean
    fullWidth?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    onClick?: () => void
}

export function Button({ text, icon, isLoading, disabled, fullWidth, type = 'submit', variant = 'primary', onClick }: ButtonProps) {
    return (
        <button type={type} disabled={disabled || isLoading} onClick={onClick} className={`action-button action-button--${variant} ${fullWidth ? 'action-button--full' : ''}`} aria-busy={!!isLoading}>
            {isLoading ? <CircleNotch size={18} className="button-spinner" aria-hidden="true" /> : icon && <span className="button-icon" aria-hidden="true">{icon}</span>}
            <span>{isLoading ? 'Aguarde…' : text}</span>
        </button>
    )
}
