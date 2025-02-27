<template>
  <AuthForm title="Reset Password" buttonText="Reset" :submit="handleReset" ref="form">
    <div class="space-y-4">
      <div>
        <label class="block text-gray-700 font-medium">Email</label>
        <input v-model="email" type="email" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label class="block text-gray-700 font-medium">Token</label>
        <input v-model="token" type="text" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label class="block text-gray-700 font-medium">New Password</label>
        <input v-model="newPassword" type="password" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
    </div>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'

const email = ref('')
const token = ref('')
const newPassword = ref('')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const form = ref<InstanceType<typeof AuthForm> | null>(null)

email.value = route.query.email as string || ''
token.value = route.query.token as string || ''

async function handleReset() {
  try {
    await authStore.resetPassword(email.value, token.value, newPassword.value)
    form.value!.message = 'Password reset successful! Redirecting to login...'
    setTimeout(() => router.push('/login'), 2000)
  } catch (error: any) {
    form.value!.error = error.response?.data?.message || 'Reset failed'
  }
}
</script>