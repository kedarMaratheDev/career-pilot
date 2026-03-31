export interface AuthUser {
    id: string
    email: string
}

export interface AuthService {
    login(email: string, password: string): Promise<AuthUser>
    logout(): Promise<void>
    getCurrentUser(): AuthUser | null
}

const AUTH_STORAGE_KEY = 'career-pilot-auth-user'

const wait = (durationMs: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, durationMs)
    })

const saveUser = (user: AuthUser) => {
    if (typeof window === 'undefined') {
        return
    }

    window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export const authService: AuthService = {
    async login(email, password) {
        await wait(350)

        const normalizedEmail = email.trim().toLowerCase()
        const hasPassword = password.trim().length > 0

        if (!normalizedEmail || !hasPassword) {
            throw new Error('Please enter both email and password.')
        }

        const user: AuthUser = {
            id: 'user-001',
            email: normalizedEmail,
        }

        saveUser(user)
        return user
    },
    async logout() {
        await wait(150)
        if (typeof window === 'undefined') {
            return
        }

        window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    },
    getCurrentUser() {
        if (typeof window === 'undefined') {
            return null
        }

        const stored = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
        if (!stored) {
            return null
        }

        try {
            return JSON.parse(stored) as AuthUser
        } catch {
            return null
        }
    },
}
