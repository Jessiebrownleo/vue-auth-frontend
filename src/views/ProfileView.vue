<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12">
    <div class="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full mx-4">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Your Profile</h2>
      <div class="space-y-6">
        <!-- Avatar and Username -->
        <div class="flex items-center space-x-6">
          <img :src="userAvatarUrl" alt="User avatar" class="h-20 w-20 rounded-full border-2 border-indigo-600">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">{{ authStore.user?.username || 'User' }}</h3>
            <p class="text-gray-600">{{ authStore.user?.email || 'No email available' }}</p>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="border-t border-gray-200 pt-6">
          <dl class="space-y-4">
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="text-sm text-gray-900">{{ authStore.user?.email }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-500">Username</dt>
              <dd class="text-sm text-gray-900">{{ authStore.user?.username }}</dd>
            </div>
<!--            <div class="flex justify-between">-->
<!--              <dt class="text-sm font-medium text-gray-500">Account Type</dt>-->
<!--              <dd class="text-sm text-gray-900">{{ authStore.user?.avatarUrl ? 'Google' : 'Email/Password' }}</dd>-->
<!--            </div>-->
          </dl>
        </div>

        <!-- Actions -->
        <div class="flex justify-center space-x-4">
          <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back to Home
          </router-link>
          <button @click="logout" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Compute user avatar URL with fallback
const userAvatarUrl = computed(() => authStore.user?.avatarUrl || 'https://lh3.googleusercontent.com/a/default-user=s96-c')

// Logout function
const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>