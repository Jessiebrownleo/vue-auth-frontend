<template>
  <nav class="bg-indigo-600 shadow-lg">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button @click="toggleMobileMenu" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" :aria-expanded="mobileMenuOpen">
            <span class="sr-only">Open main menu</span>
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-white text-2xl font-semibold tracking-tight">DotnetAuth</router-link>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <router-link to="/" class="text-indigo-200 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/' }">Home</router-link>
              <router-link v-if="!isAuthenticated" to="/login" class="text-indigo-200 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/login' }">Login</router-link>
              <router-link v-if="!isAuthenticated" to="/register" class="text-indigo-200 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/register' }">Register</router-link>
            </div>
          </div>
        </div>
        <div v-if="isAuthenticated" class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button @click="toggleProfileMenu" type="button" class="bg-indigo-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="userAvatarUrl" alt="User avatar">

              </button>
            </div>
            <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="profileMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</router-link>
<!--                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</router-link>-->
                <a @click="logout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="mobileMenuOpen" class="sm:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="text-indigo-200 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/' }">Home</router-link>
          <router-link v-if="!isAuthenticated" to="/login" class="text-indigo-200 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/login' }">Login</router-link>
          <router-link v-if="!isAuthenticated" to="/register" class="text-indigo-200 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/register' }">Register</router-link>
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="text-indigo-200 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/profile' }">Your Profile</router-link>
<!--            <router-link to="/settings" class="text-indigo-200 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" :class="{ 'bg-indigo-700 text-white': $route.path === '/settings' }">Settings</router-link>-->
            <a @click="logout" href="#" class="text-indigo-200 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign out</a>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userAvatarUrl = computed(() => authStore.user?.avatarUrl || 'https://static.vecteezy.com/system/resources/thumbnails/020/911/746/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png')
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    profileMenuOpen.value = false
  }
}
console.log("profileUrl",userAvatarUrl)
const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const logout = async () => {
  try {
    await authStore.logout()
    profileMenuOpen.value = false
    mobileMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close menus when clicking outside
const closeMenus = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('#mobile-menu') && !target.closest('#user-menu-button')) {
    mobileMenuOpen.value = false
    profileMenuOpen.value = false
  }
}

// Add event listener for closing menus
document.addEventListener('click', closeMenus)
</script>