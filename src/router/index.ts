import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import ProfileView from '../views/ProfileView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/register', name: 'register', component: RegisterView },
        { path: '/verify-email', name: 'verify-email', component: VerifyEmailView },
        { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
        { path: '/reset-password', name: 'reset-password', component: ResetPasswordView },
        { path: '/profile', name: 'profile', component: ProfileView },
    ]
})

router.beforeEach((to, _, next) => {
    const authStore = useAuthStore()
    if (to.name !== 'login' && to.name !== 'register' && to.name !== 'verify-email' && !authStore.isAuthenticated) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router