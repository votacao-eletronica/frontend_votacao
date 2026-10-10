import type { MouseEvent, ReactNode } from 'react'

type IconButtonProps = {
    icon: ReactNode
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    title?: string
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit' | 'reset'
}

export function IconButton({ icon, onClick, title, disabled, variant = 'primary', type = 'button' }: IconButtonProps) {
    return <button type={type} onClick={onClick} disabled={disabled} title={title} aria-label={title} className={`icon-action icon-action--${variant}`}>{icon}</button>
}
