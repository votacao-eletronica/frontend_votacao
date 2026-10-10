import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X, NotePencil } from 'phosphor-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
    const titleId = useId()
    const descriptionId = useId()
    const panelRef = useRef<HTMLDivElement>(null)
    const closeRef = useRef(onClose)
    useEffect(() => { closeRef.current = onClose }, [onClose])
    useEffect(() => {
        if (!isOpen) return
        const previousFocus = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const panel = panelRef.current
        const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]') ?? []).filter(element => element.getClientRects().length > 0)
        panel?.focus()
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
            if (event.key !== 'Tab') return
            const elements = focusable()
            const first = elements[0]
            const last = elements[elements.length - 1]
            if (!first) { event.preventDefault(); panel?.focus(); return }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus() }
            else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) { event.preventDefault(); first.focus() }
        }
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = previousOverflow
            previousFocus?.focus()
        }
    }, [isOpen])
    if (!isOpen) return null
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div ref={panelRef} className="modal-panel" role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : 'Formulário'} aria-describedby={description ? descriptionId : undefined} tabIndex={-1} onClick={event => event.stopPropagation()}>
                <header className="modal-header">
                    <span className="modal-symbol"><NotePencil size={23} /></span>
                    <div className="modal-heading">
                        {title && <h2 id={titleId}>{title}</h2>}
                        {description && <p id={descriptionId}>{description}</p>}
                    </div>
                    <button type="button" onClick={onClose} className="modal-close" aria-label="Fechar janela"><X size={20} /></button>
                </header>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    )
}
