import type { ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-[#000000dd] bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
                {children}
            </div>
        </div>
    )
}
