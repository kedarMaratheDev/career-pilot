import {
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import type { ToastTone } from './ToastContext'
import { ToastContext, type ToastContextValue } from './ToastContext'
import './ToastProvider.css'

interface ToastItem {
    id: string
    message: string
    tone: ToastTone
}


interface ToastProviderProps {
    children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const dismissToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
        const id = crypto.randomUUID()
        setToasts((current) => [...current, { id, message, tone }])

        window.setTimeout(() => {
            dismissToast(id)
        }, 3200)
    }, [dismissToast])

    const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-viewport" aria-live="polite" aria-atomic="true">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast--${toast.tone}`}>
                        <p>{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            aria-label="Dismiss notification"
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
