import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

// Extend Window interface for Google Identity Services
interface GoogleWindow extends Window {
    google?: {
        accounts: {
            id: {
                initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
                renderButton: (element: HTMLElement, options: { theme: string; size: string }) => void
            }
        }
    }
}

interface User {
    email: string
    username: string
    avatarUrl?: string
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token') || sessionStorage.getItem('token'))
    const isAuthenticated = ref(!!token.value)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const email = ref<string | null>(null)
    const user = ref<User | null>(null)
    const googleScriptLoaded = ref(false)

    function waitForGoogleScript(): Promise<void> {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true
            script.onload = () => {
                console.log('Google script loaded')
                googleScriptLoaded.value = true
                resolve()
            }
            script.onerror = () => {
                console.error('Failed to load Google script')
                resolve()
            }
            if ((window as GoogleWindow).google) {
                googleScriptLoaded.value = true
                resolve()
            } else {
                document.head.appendChild(script)
            }
        })
    }

    async function login(email: string, password: string, rememberMe: boolean = false) {
        console.log('Login request:', { email, password, rememberMe })
        const response = await axios.post(`${apiBaseUrl}/login`, { email, password })
        console.log('Login response:', response.data)
        token.value = response.data.token
        user.value = { email: response.data.email, username: response.data.username }
        if (rememberMe) {
            localStorage.setItem('token', token.value!)
        } else {
            sessionStorage.setItem('token', token.value!)
        }
        isAuthenticated.value = true
        console.log('Store updated:', { token: token.value, user: user.value, isAuthenticated: isAuthenticated.value })
    }

    async function register(username: string, regEmail: string, password: string) {
        await axios.post(`${apiBaseUrl}/register`, { username, email: regEmail, password })
        email.value = regEmail
    }

    async function verifyEmail(email: string, otp: string) {
        await axios.post(`${apiBaseUrl}/verify-email`, null, { params: { email, otp } })
    }

    async function forgotPassword(email: string) {
        await axios.post(`${apiBaseUrl}/forgot-password`, { email })
    }

    async function resetPassword(email: string, token: string, newPassword: string) {
        await axios.post(`${apiBaseUrl}/reset-password`, { email, token, newPassword })
    }

    async function googleLogin(idToken: string) {
        console.log('Google login request with idToken:', idToken)
        const response = await axios.post(`${apiBaseUrl}/google-login`, { idToken })
        console.log('Google login response:', response.data)
        token.value = response.data.token
        user.value = { email: response.data.email, username: response.data.username, avatarUrl: response.data.avatarUrl }
        localStorage.setItem('token', token.value!)
        isAuthenticated.value = true
        console.log('Store updated:', { token: token.value, user: user.value, isAuthenticated: isAuthenticated.value })
    }

    async function initGoogleAuth(onSuccess: (credential: string) => void) {
        await waitForGoogleScript()
        const win = window as GoogleWindow
        if (win.google && googleScriptLoaded.value) {
            console.log('Initializing Google Auth...')
            win.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: (response: { credential: string }) => {
                    console.log('Google callback triggered')
                    onSuccess(response.credential)
                },
            })
            const buttonElement = document.getElementById('google-signin-button')
            if (buttonElement) {
                win.google.accounts.id.renderButton(buttonElement, { theme: 'outline', size: 'large' })
                console.log('Google button rendered')
            } else {
                console.error('Google Sign-In button element not found')
            }
        } else {
            console.error('Google Identity Services script not loaded after wait')
        }
    }

    function logout() {
        token.value = null
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        isAuthenticated.value = false
        email.value = null
        user.value = null
        console.log('Logged out, store reset')
    }

    return { token, isAuthenticated, email, user, login, register, verifyEmail, forgotPassword, resetPassword, googleLogin, initGoogleAuth, logout }
})