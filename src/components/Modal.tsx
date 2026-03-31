import { useEffect, type MouseEvent, type ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
    isOpen: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
    useEffect(() => {
        if (!isOpen) {
            return
        }

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscapeKey)
        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [isOpen, onClose])

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className="modal-backdrop" role="presentation" onMouseDown={handleBackdropClick}>
            <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
                <header className="modal__header">
                    <h2>{title}</h2>
                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        x
                    </button>
                </header>
                <div className="modal__content">{children}</div>
            </section>
        </div>
    )
}
